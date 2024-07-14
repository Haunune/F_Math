import { Slide, toast, ToastContainer } from "react-toastify";
import ButtonLearn from "../../components/ButtonLearn";
import { child, get, ref, set } from "firebase/database";
import { database } from "../../firebase/firebase";
import { useCallback, useEffect, useRef, useState } from "react";
import { toolbox } from '../../blockly/toolbox';
import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import * as libraryBlocks from 'blockly/blocks';
import * as En from 'blockly/msg/en';
import { useLocation } from "react-router-dom";

Blockly.setLocale(En);

function AdvancedEx({userInfo}) {
    const location = useLocation();
    const dbRef = ref(database);
    const workspaceRef = useRef(null);
    const blocklyDiv = useRef(null);
    const [workspace, setWorkspace] = useState(null);
    const [lecturessArray, setLecturesArray] = useState([]);
    const [result, setResult] = useState(null);
    const [completedLectures, setCompletedLectures] = useState([]);
    const [topic, setTopic] = useState({});
    const [selected, setSelected] = useState(null);
    const [numbers, setNumbers] = useState(null);
    const [isInstruct, setIsInstruct] = useState(false);
    const [user, setUser] = useState(userInfo);

    useEffect(() => {
        get(child(dbRef, `advanced_exercise`)).then((snapshot) => {
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

            // trường hợp cần theo hướng dẫn
            if (isInstruct) {
                const codeArray = code.split(" ");

                // kiểm tra định dạng
                if ((codeArray[1] === '+' || codeArray[1] === '-') && codeArray[3] === '==') {
                    console.log(codeArray)
                    const number = numbers.split(" ");
                    const num1 = codeArray[0].replace(/[()]/g, '');

                    if (codeArray[1] === '+') {
                        if ((num1 === number[0] && codeArray[2] === number[1]) || (num1 === number[1] && codeArray[2] === number[0])) {
                            try {
                                const evalResult = eval(code);
                                setResult(evalResult);
                            } catch (error) {
                                console.error('Error executing Blockly generated code:', error);
                                setResult('Error executing Blockly generated code');
                            }
                        } else {
                            toast.warning("You need to enter the correct number according to the requirements of the question!", {
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
                    } else {
                        if (codeArray[1] === '-') {
                            if ((num1 === number[0] && codeArray[2] === number[1])) {
                                try {
                                    const evalResult = eval(code);

                                    setResult(evalResult);
                                } catch (error) {
                                    console.error('Error executing Blockly generated code:', error);
                                    setResult('Error executing Blockly generated code');
                                }
                            } else {
                                toast.warning("You need to enter the correct number according to the requirements of the question!", {
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
                    }
                } else {
                    toast.warning("You need to enter the correct format according to the instructions!", {
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
        }
    };

    useEffect(() => {
        if (result !== null && result !== undefined) {
            notify();
            setResult(null);
        }
    }, [result]);

    const notify = () => {
        if (result == topic.resultAdEx) {
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

            saveCompletedLecture(user.id, topic.id, topic.title)

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

        if (lecture.imgUrl) {
            // tạo block
            Blockly.defineBlocksWithJsonArray([
                {
                    "type": "question_block",
                    "message0": "Question: %1\n%2\nAnswer: %3",
                    "args0": [
                        {
                            "type": "field_label_serializable",
                            "name": "QUESTION",
                            "text": "Your question here",
                        },
                        {
                            "type": "field_image",
                            "src": lecture.imgUrl,
                            "width": 500,
                            "height": 200,
                            "alt": "Exercise IMG"
                        },
                        {
                            "type": "input_value",
                            "name": "ANSWER"
                        }
                    ],
                    "colour": '#DB7093',
                    "tooltip": "",
                    "helpUrl": "",
                }
            ]);
        } else {
            // tạo block
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
                    "helpUrl": "",
                }
            ]);
        }

        const newBlock = workspaceRef.current.newBlock('question_block');
        newBlock.setFieldValue(lecture.contentAd, 'QUESTION');
        newBlock.moveBy(10, 50);
        newBlock.initSvg();
        newBlock.render();

        // tạo khối hình ảnh
        if (lecture.imgEx) {
            if (lecture.instruct) {
                Blockly.defineBlocksWithJsonArray([
                    {
                        "type": "image_block",
                        "message0": "Remember \n%1\n To pass this test you need to follow the following structure\n%2",
                        "args0": [
                            {
                                "type": "field_image",
                                "src": lecture.imgEx,
                                "width": 500,
                                "height": 150,
                                "alt": "Example Image"
                            },
                            {
                                "type": "field_image",
                                "src": lecture.instruct,
                                "width": 500,
                                "height": 150,
                                "alt": "Instruct Image"
                            }
                        ],
                        "colour": 160,
                        "tooltip": "",
                        "helpUrl": ""
                    },
                ]);

                setIsInstruct(true);
                setNumbers(lecture.numbers);
            } else {
                Blockly.defineBlocksWithJsonArray([
                    {
                        "type": "image_block",
                        "message0": "Remember \n%1",
                        "args0": [
                            {
                                "type": "field_image",
                                "src": lecture.imgEx,
                                "width": 500,
                                "height": 150,
                                "alt": "Example Image"
                            }
                        ],
                        "colour": 160,
                        "tooltip": "",
                        "helpUrl": ""
                    },
                ]);
            }

            const imgBlock = workspaceRef.current.newBlock('image_block');
            imgBlock.moveBy(10, 30);
            imgBlock.initSvg();
            imgBlock.render();

            newBlock.moveBy(10, imgBlock.getHeightWidth().height + 20);
        }
    }, [workspaceRef]);

    useEffect(() => {
        if (lecturessArray.length > 0) {
            handleClick(lecturessArray[0]);
        }
    }, [lecturessArray, handleClick]);

    useEffect(() => {
        if (completedLectures.length > 0) {
            const currentIndex = lecturessArray.findIndex(lecture => lecture.id === selected);
            if (currentIndex < lecturessArray.length - 1) {
                handleClick(lecturessArray[currentIndex + 1]);
            }
        }
    }, [completedLectures, lecturessArray, handleClick]);

    // update bài học đã hoàn thành cho user
    const saveCompletedLecture = async (user, lectureId, title) => {
        const completeAt = new Date().toISOString();
        const score = 20;

        await set(child(dbRef, `accounts/${user.replace("User","")}/completedLectures/` + `advanced/${lectureId}`), {
            title,
            completeAt,
            score,
        }).catch((error) => {
            alert("Error Creating Data:", error.message)
        })
    }

    // cập nhật bài học
    useEffect(() => {
        const fetchCompletedLectures = async () => {
            const snapshot = await get(child(dbRef, `accounts/${user.id.replace("User","")}/completedLectures/advanced`));
            if (snapshot.exists()) {
                const completed = Object.keys(snapshot.val());
                setCompletedLectures(completed);
                
                const lastCompletedLecture = completed[completed.length - 1];
                const lastCompletedIndex = lecturessArray.findIndex(lecture => lecture.id === lastCompletedLecture);
                if (lastCompletedIndex !== -1 && lastCompletedIndex < lecturessArray.length - 1) {
                    handleClick(lecturessArray[lastCompletedIndex]);
                } else {
                    handleClick(lecturessArray[0]);
                }
            } else {
                handleClick(lecturessArray[0]);
            }
        };

        if (user && lecturessArray.length > 0) {
            fetchCompletedLectures();
        }
    }, [user, lecturessArray]);

    return (
        <div className="w-full h-20 bg-lime-100  mt-10 min-h-screen translate-x-0 translate-y-0">
            <ToastContainer />
            <div className="flex">
                <div className="min-h-screen overflow-y-auto w-56 h-20 bg-lime-100 font-semibold mt-2">
                    {
                        lecturessArray.map((lecture, index) => (
                            <button onClick={() => (index > 0 && !completedLectures.includes(lecturessArray[index - 1].id)) ? null : handleClick(lecture)}
                                key={lecture.id}
                                className={`h-14 w-full mb-3 rounded shadow focus:bg-green-500 ${selected === lecture.id ? 'bg-green-500' : 'bg-rose-300'} ${ (index > 0 && !completedLectures.includes(lecturessArray[index - 1].id)) ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={ (index > 0 && !completedLectures.includes(lecturessArray[index - 1].id))}
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

export default AdvancedEx;