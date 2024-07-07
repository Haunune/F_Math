import { Slide, toast, ToastContainer } from "react-toastify";
import ButtonLearn from "../../components/ButtonLearn";
import { child, get, ref } from "firebase/database";
import { database } from "../../firebase/firebase";
import { useCallback, useEffect, useRef, useState } from "react";
import { toolbox } from '../../blockly/toolbox';
import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import * as libraryBlocks from 'blockly/blocks';
import * as En from 'blockly/msg/en';

Blockly.setLocale(En);

function BasicEx() {
    const dbRef = ref(database);
    const workspaceRef = useRef(null);
    const blocklyDiv = useRef(null);
    const [workspace, setWorkspace] = useState(null);
    const [lecturessArray, setLecturesArray] = useState([]);
    const [result, setResult] = useState(null);
    const [completedLectures, setCompletedLectures] = useState([]);
    const [topic, setTopic] = useState({});
    const [selected, setSelected] = useState(null);


    useEffect(() => {
        get(child(dbRef, `basic_exercise`)).then((snapshot) => {
            if (snapshot.exists()) {
                setLecturesArray(Object.values(snapshot.val()));
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [dbRef])

    // tạo workspace
    useEffect(() => {
        if (blocklyDiv.current) {
            workspaceRef.current = Blockly.inject(blocklyDiv.current, {
                toolbox: toolbox,
                collapse: true,
                scrollbars: false,
                move: {
                    scrollbars: true,
                    drag: true,
                    wheel: true
                },
                zoom:
                {
                    controls: true,
                    wheel: true,
                    startScale: 1.0,
                    maxScale: 3,
                    minScale: 0.3,
                    scaleSpeed: 1.2,
                    pinch: true
                },
                trashcan: true
            });

            setWorkspace(workspaceRef.current);
        }

        return () => {
            if (workspaceRef.current) {
                workspaceRef.current.dispose();
            }
        };
    }, []);

    // chạy khối trong workspace
    const runCode = () => {
        if (workspace) {
            javascriptGenerator.forBlock['image_block'] = function (block) {
                var imageUrl = block.getFieldValue('IMG');
                return imageUrl;
            };

            javascriptGenerator.forBlock['question_block'] = function (block) {
                var question = block.getFieldValue('QUESTION');
                var answer = javascriptGenerator.valueToCode(block, 'ANSWER', javascriptGenerator.ORDER_ATOMIC);
                return answer;
            };

            const code = javascriptGenerator.workspaceToCode(workspaceRef.current);

            try {
                const evalResult = eval(code);
                setResult(evalResult);
            } catch (error) {
                console.error('Error executing Blockly generated code:', error);
                setResult('Error executing Blockly generated code');
            }


            if (result !== null && result !== undefined) {
                console.log("final result ", result)
                // notify();
                setResult(null);
            }
        }
    };

    const notify = () => {
        if (result === topic.resultBsEx) {
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

        } else {
            toast.error("Opps, the answer is wrong!", {
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

    const handleClick = useCallback((lecture) => {
        setTopic(lecture);
        setSelected(lecture.id)
        clearWorkspace();

        Blockly.defineBlocksWithJsonArray([
            {
                "type": "question_block",
                "message0": "Question: %1\nAnswer: %2",
                "args0": [
                    {
                        "type": "field_label_serializable",
                        "name": "QUESTION",
                        "text": "Your question here",
                    },
                    {
                        "type": "input_value",
                        "name": "ANSWER",
                    },
                ],
                "colour": '#DB7093',
                "tooltip": "",
                "helpUrl": ""
            }
        ]);


        // tạo khối câu hỏi
        const questionBlock = workspaceRef.current.newBlock('question_block');
        questionBlock.setFieldValue(lecture.contentBs, 'QUESTION');
        questionBlock.moveBy(250, 150);
        questionBlock.initSvg();
        questionBlock.render();


    }, [workspaceRef]);

    useEffect(() => {
        if (lecturessArray.length > 0) {
            handleClick(lecturessArray[0]);
        }
    }, [lecturessArray, handleClick])

    return (
        <div className="w-full h-20 bg-lime-100  mt-10 min-h-screen translate-x-0 translate-y-0">
            <ToastContainer />
            <div className="flex">
                <div className="min-h-screen w-56 h-20 bg-lime-100 font-semibold mt-2">
                    {
                        lecturessArray.map((lecture, index) => (
                            <button onClick={() => completedLectures.includes(lecture.id) || (index > 0 && !completedLectures.includes(lecturessArray[index - 1].id)) ? null : handleClick(lecture)}
                                key={lecture.id}
                                className={`h-32 w-full p-3 mb-3 rounded shadow focus:bg-green-500 ${selected === lecture.id ? 'bg-green-500' : 'bg-rose-300'} ${completedLectures.includes(lecture.id) || (index > 0 && !completedLectures.includes(lecturessArray[index - 1].id)) ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={completedLectures.includes(lecture.id) || (index > 0 && !completedLectures.includes(lecturessArray[index - 1].id))}
                            >
                                {lecture.title}
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
    );
}

export default BasicEx;