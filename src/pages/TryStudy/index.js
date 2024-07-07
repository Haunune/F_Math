import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import 'blockly/javascript';
import * as En from 'blockly/msg/en';
import { useCallback, useEffect, useRef, useState } from "react";
import { toolbox } from "../../blockly/toolbox";
import ButtonLearn from "../../components/ButtonLearn";
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { child, get, ref } from "firebase/database";
import { database } from "../../firebase/firebase";
import { javascriptGenerator } from "blockly/javascript";

Blockly.setLocale(En);

function TryStudy() {
    const blocklyDiv = useRef(null);
    const workspaceRef = useRef(null);
    const dbRef = ref(database);
    const [workspace, setWorkspace] = useState(null);
    const [resultCheck, setResult] = useState(null);
    const [selected, setSelected] = useState(null);
    const [tryLectures, setTryLectures] = useState([]);
    const [topic, setTopic] = useState({});
    const [completedLectures, setCompletedLectures] = useState([]);


    useEffect(() => {
        get(child(dbRef, `try_lectures`)).then((snapshot) => {
            if (snapshot.exists()) {
                setTryLectures(Object.values(snapshot.val()));
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [dbRef])

    useEffect(() => {
        if (blocklyDiv.current || !workspaceRef.current) {
            workspaceRef.current = Blockly.inject(blocklyDiv.current, {
                toolbox: toolbox,
                move: {
                    scrollbars: true,
                    drag: true,
                    wheel: true
                }
            });
            setWorkspace(workspaceRef.current);
        }

        return () => {
            if (workspaceRef.current) {
                workspaceRef.current.dispose();
            }
        };
    }, []);

    const runCode = () => {
        if (workspace) {
            javascriptGenerator.forBlock['question_block'] = function (block) {
                var num1 = javascriptGenerator.valueToCode(block, 'NUM1', javascriptGenerator.ORDER_ATOMIC);
                var num2 = javascriptGenerator.valueToCode(block, 'NUM2', javascriptGenerator.ORDER_ATOMIC);
                var operator = block.getFieldValue('OPERATOR');
                var symbol = block.getFieldValue('COMPARE');

                // kiểm tra đầu vào có phải là số  hay không
                if (isNaN(num1) || isNaN(num2)) {
                    toast.error("Opps, Input must be a number!", {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Slide,
                    })
                }

                if (symbol === 'LT') {
                    if (operator === 'ADD') {
                        return `${num1} + ${num2} < 70`;
                    } else if (operator === 'SUBTRACT') {
                        return `${num1} - ${num2} < 70`;
                    }
                }

                if (operator === 'ADD') {
                    return `${num1} + ${num2}`;
                } else if (operator === 'SUBTRACT') {
                    return `${num1} - ${num2}`;
                }
            };
            try {
                const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
                const evalResult = eval(code);
                setResult(evalResult);

            } catch (error) {
                console.error('Error executing Blockly generated code:', error);
                setResult('Error executing Blockly generated code');
            }
        }

        if (resultCheck) {
            notify();
            setResult(null);
        }

    };

    const test = topic.result;
    const notify = () => {
        if (resultCheck === test) {
            toast.success("Congratulations on the correct answer!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
            })
            setCompletedLectures([...completedLectures, selected]);

            const currentIndex = tryLectures.findIndex(lecture => lecture.id === selected);
            if (currentIndex < tryLectures.length - 1) {
                handleTopicClick(tryLectures[currentIndex + 1]);
            }
        } else {
            toast.error("Opps, The answer is wrong!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
            })
        }
    }

    const clearWorkspace = () => {
        if (workspaceRef.current) {
            workspaceRef.current.clear();
        }
    };

    const handleTopicClick = useCallback((try_lecture) => {
        setTopic(try_lecture);
        setSelected(try_lecture.id)
        clearWorkspace();
        if (try_lecture.id === "try3") {
            Blockly.defineBlocksWithJsonArray([
                {
                    "type": "question_block",
                    "message0": "Question: %1\nAnswer: %2 %3 %4 %5 %6",
                    "args0": [
                        {
                            "type": "field_label_serializable",
                            "name": "QUESTION",
                            "text": "Your question here",
                        },
                        {
                            "type": "input_value",
                            "name": "NUM1",
                            "check": "Number"
                        },
                        {
                            "type": "field_dropdown",
                            "name": "OPERATOR",
                            "options": [
                                ["+", "ADD"],
                                ["-", "SUBTRACT"]
                            ]
                        },
                        {
                            "type": "input_value",
                            "name": "NUM2",
                            "check": "Number"
                        },
                        {
                            "type": "field_dropdown",
                            "name": "COMPARE",
                            "options": [
                                ["<", "LT"]
                            ]
                        },
                        {
                            "type": "field_label",
                            "name": "RESULT",
                            "text": "Your question here",
                        },
                    ],
                    "colour": '#DB7093',
                    "tooltip": "",
                    "helpUrl": ""
                }
            ]);
        } else {
            Blockly.defineBlocksWithJsonArray([
                {
                    "type": "question_block",
                    "message0": "Question: %1\nAnswer: %2 %3 %4 = %5",
                    "args0": [
                        {
                            "type": "field_label_serializable",
                            "name": "QUESTION",
                            "text": "Your question here",
                        },
                        {
                            "type": "input_value",
                            "name": "NUM1",
                            "check": "Number"
                        },
                        {
                            "type": "field_dropdown",
                            "name": "OPERATOR",
                            "options": [
                                ["+", "ADD"],
                                ["-", "SUBTRACT"]
                            ]
                        },
                        {
                            "type": "input_value",
                            "name": "NUM2",
                            "check": "Number"
                        },
                        {
                            "type": "field_label",
                            "name": "RESULT",
                            "text": "Your question here",
                        },
                    ],
                    "colour": '#DB7093',
                    "tooltip": "",
                    "helpUrl": ""
                }
            ]);
        }


        // tạo khối câu hỏi
        const questionBlock = workspaceRef.current.newBlock('question_block');
        questionBlock.setFieldValue(try_lecture.content, 'QUESTION');
        questionBlock.setFieldValue(try_lecture.key, 'RESULT')
        questionBlock.moveBy(250, 150);
        questionBlock.initSvg();
        questionBlock.render();


    }, [workspaceRef]);

    useEffect(() => {
        if (tryLectures.length > 0) {
            handleTopicClick(tryLectures[0]);
        }
    }, [tryLectures, handleTopicClick])

    return (
        <div>
            <Header />
            <Navbar />
            <div className={"bg-navbar min-h-screen translate-x-0 translate-y-0"}>
                <div className="w-full h-20 bg-navbar">
                    <ToastContainer />
                    <div className="flex">
                        <div className="min-h-screen w-56 h-20 bg-navbar font-semibold mt-2">
                            {
                                tryLectures.map((try_lecture, index) => (
                                    <button onClick={() => completedLectures.includes(try_lecture.id) || (index > 0 && !completedLectures.includes(tryLectures[index - 1].id)) ? null : handleTopicClick(try_lecture)}
                                        key={try_lecture.id}
                                        className={`h-32 w-full p-3 mb-3 rounded shadow focus:bg-green-500 ${selected === try_lecture.id ? 'bg-green-500' : 'bg-rose-300'} ${completedLectures.includes(try_lecture.id) || (index > 0 && !completedLectures.includes(tryLectures[index - 1].id)) ? 'cursor-not-allowed opacity-50' : ''}`}
                                        disabled={completedLectures.includes(try_lecture.id) || (index > 0 && !completedLectures.includes(tryLectures[index - 1].id))}
                                    >
                                        {try_lecture.title}
                                    </button>
                                ))
                            }
                        </div>
                        <div ref={blocklyDiv} className={"border-2 w-screen h-screen"}></div>
                        <div className="absolute right-0">
                            <ButtonLearn onclick={runCode} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default TryStudy;