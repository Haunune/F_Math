import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import 'blockly/javascript';
import * as En from 'blockly/msg/en';
import { useEffect, useRef, useState } from "react";
import { toolbox } from "../../blockly/toolbox";
import ButtonLearn from "../../components/ButtonLearn";
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { child, get, ref } from "firebase/database";
import { database } from "../../firebase/firebase";
import { javascriptGenerator } from "blockly/javascript";

Blockly.setLocale(En);

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
                "name": "ANSWER"
            }
        ],
        "colour": '#DB7093',
        "tooltip": "",
        "helpUrl": ""
    }
]);

function TryStudy() {
    const blocklyDiv = useRef(null);
    const workspaceRef = useRef(null);
    const dbRef = ref(database);
    const [workspace, setWorkspace] = useState(null);
    const [result, setResult] = useState(null);
    const [tryLectures, setTryLectures] = useState([]);
    const [topic, setTopic] = useState({});


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
        }

        if (result) {
            notify();
            setResult(null);
        }

    };

    const test = topic.result;
    const notify = () => {
        if (result === test) {
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
        } else {
            toast.error("Opps, the answer is wrong!", {
                position: "top-right",
                autoClose: 5000,
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

    const handleTopicClick = (try_lecture) => {
        setTopic(try_lecture);
        clearWorkspace();

        const newBlock = workspaceRef.current.newBlock('question_block');
        newBlock.setFieldValue(try_lecture.content, 'QUESTION');
        newBlock.initSvg();
        newBlock.render();
    };

    useEffect(() => {
        if (tryLectures.length > 0) {
            handleTopicClick(tryLectures[0]);
        }
    }, [tryLectures])

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
                                tryLectures.map((try_lecture) => (
                                    <button onClick={() => handleTopicClick(try_lecture)} key={try_lecture.id} className={`bg-rose-300 h-32 w-full p-3 mb-3 rounded shadow hover:bg-green-400 focus:bg-green-500 ${tryLectures[0].id ===  topic.id ? `bg-green-500` : `bg-rose-300`}`} >{try_lecture.content}</button>
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