import { child, get, ref, set } from "firebase/database";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useRef, useState } from "react";
import { database } from "../../firebase/firebase";
import { SignOut } from "../../firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonLearn from "../../components/ButtonLearn";
import { toolbox } from '../../blockly/toolbox';
import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import * as libraryBlocks from 'blockly/blocks';
import * as En from 'blockly/msg/en';
import { Slide, ToastContainer, toast } from 'react-toastify';
import BasicEx from "../BasicEx";
import AdvancedEx from "../AdvancedEx";



Blockly.setLocale(En);


function ExerciseStudy() {
    const location = useLocation();
    const { t } = useTranslation(['study']);
    const dbRef = ref(database);
    const workspaceRef = useRef(null);
    const blocklyDiv = useRef(null);
    const [workspace, setWorkspace] = useState(null);

    const [lecturessArray, setLecturesArray] = useState([]);

    const [lesson, setLessons] = useState(location.state.lesson);

    const [IdLectures, setIdLectures] = useState(location.state.IdLectures);
    const [user, setUser] = useState(null);
    const [result, setResult] = useState(null);
    const [completedLectures, setCompletedLectures] = useState([]);
    const [isInstruct, setIsInstruct] = useState(false);
    const [isFirst, setIsFisrt] = useState(true);
    const [selected, setSelected] = useState(null);
    const [numbers, setNumbers] = useState(null);

    const [Ex, setEx] = useState(true);
    const [basicEx, setBasicEx] = useState(false);
    const [advancedEx, setAdvancedEx] = useState(false);


    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        get(child(dbRef, `lectures/${IdLectures.charAt(IdLectures.length - 1)}/lessons`)).then((snapshot) => {
            if (snapshot.exists()) {
                setLecturesArray(Object.values(snapshot.val()));
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [dbRef])

    const onSignOut = () => {
        SignOut();
        localStorage.removeItem('user');
        navigate('/')
    }


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


            // trường hợp cần theo hướng dẫn
            if (isInstruct) {
                const codeArray = code.split(" ");
                // kiểm tra định dạng
                if ((codeArray[1] === '+' || codeArray[1] === '-' || codeArray[1] === '*' || codeArray[1] === '/') && codeArray[3] === '==') {
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
                        if (codeArray[1] === '*') {
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
                            if (codeArray[1] === '/') {
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
                    }
                    setIsInstruct(false);
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
                setIsInstruct(false);
            } else {
                try {
                    const evalResult = eval(code);
                    setResult(evalResult);
                    setIsInstruct(false);
                } catch (error) {
                    console.error('Error executing Blockly generated code:', error);
                    setResult('Error executing Blockly generated code');
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
        if (result == lesson.resultLecture) {
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

            saveCompletedLecture(user.id, lesson.id, lesson.title);

            if (lesson && IdLectures) {
                window.history.replaceState(null, '', `/study/semester1/${IdLectures}/${lesson.id}`, { replace: true });
            }

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
        clearWorkspace();
        setLessons(lecture);
        setSelected(lecture.id);

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
        newBlock.setFieldValue(lecture.lecture_content, 'QUESTION');
        newBlock.moveBy(10, 50);
        newBlock.initSvg();
        newBlock.render();

        // tạo khối hình ảnh
        if (lecture.imgEx) {
            if (lecture.instruct) {
                Blockly.defineBlocksWithJsonArray([
                    {
                        "type": "image_block",
                        "message0": "%1\n To pass this test you need to follow the following structure\n%2",
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
                        "message0": "%1",
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
    }, [workspaceRef, navigate])

    useEffect(() => {
        if (completedLectures.length >= 0 && lecturessArray.length > 0) {
            const currentIndex = lecturessArray.findIndex(lecture => lecture.id === selected);
            const lastLecture = lecturessArray[lecturessArray.length - 1];
            
            if (completedLectures.includes(selected) && currentIndex < lecturessArray.length - 1) {
                if(isFirst){
                    handleClick(lecturessArray[currentIndex]);
                    setIsFisrt(false);
                }else{
                    handleClick(lecturessArray[currentIndex + 1]);
                }
            }

            if (selected === lastLecture.id && completedLectures.includes(lastLecture.id)) {
                toast.success("Congratulations on completing the chapter. Please select the next chapter to learn a new lesson.", {
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
    }, [completedLectures, lecturessArray, handleClick]);

    // update bài học đã hoàn thành cho user
    const saveCompletedLecture = async (user, lectureId, title) => {
        const completeAt = new Date().toISOString();
        const score = 10;

        await set(child(dbRef, `accounts/${user.replace("User", "")}/completedLectures/` + lectureId), {
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
            const snapshot = await get(child(dbRef, `accounts/${user.id.replace("User", "")}/completedLectures`));
            if (snapshot.exists()) {
                const completed = Object.keys(snapshot.val());
                setCompletedLectures(completed);

                const lastCompletedLecture = completed[completed.length - 1];
                const lastCompletedIndex = lecturessArray.findIndex(lecture => lecture.id === lastCompletedLecture);
                if (lastCompletedIndex !== -1 && lastCompletedIndex < lecturessArray.length - 1) {
                    handleClick(lecturessArray[lastCompletedIndex + 1]);
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

    const BasicExercise = () => {
        setEx(false);
        setBasicEx(!basicEx);
        setAdvancedEx(false);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/study/basic-exercise');
    }

    const AdvancedExercise = () => {
        setEx(false);
        setAdvancedEx(!advancedEx);
        setBasicEx(false);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/study/advanced-exercise');
    }


    const Exercise = () => {
        setEx(!Ex);
        setBasicEx(false);
        setAdvancedEx(false);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/study');
    }

    const handleSemester = () => {
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/study');
    }

    return (
        <div>
            <Header onClick={onSignOut} user={user} />
            <Navbar user={user} />
            <div className="bg-navbar min-h-screen p-4 justify-center">
                <div className="text-center">
                    <p className=" font-semibold text-4xl font-medium mb-6">{t('Learning math is always fun')}</p>
                    <div className="flex justify-center">
                        <div onClick={() => Exercise()} className={`hover:bg-blue-500 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl ${Ex ? 'bg-blue-500' : 'bg-sky-300 '}`}>{t('Learn by topic')}</div>
                        <button onClick={() => BasicExercise()} className={`hover:bg-blue-500 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl ${basicEx ? 'bg-blue-500' : 'bg-sky-300 '}`}>{t('Basic exercises')}</button>
                        <button onClick={() => AdvancedExercise()} className={`hover:bg-blue-500 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl ${advancedEx ? 'bg-blue-500' : 'bg-sky-300 '}`}>{t('Advanced exercises')}</button>
                    </div>
                    {/* content */}
                    {
                        Ex ?
                            <div className="flex min-h-screen w-full mt-6 border rounded border-black">
                                <div className="flex flex-col w-2/12 bg-lime-100 max-h-screen border-r-2 border-black overflow-y-auto">
                                    <button onClick={() => handleSemester()} className="p-6 text-base text-indigo-700 font-bold hover:bg-lime-400 focus:bg-lime-400 border">{(IdLectures.charAt(IdLectures.length - 1) <= 4) ? "Semester 1" : "Semester 2"}</button>
                                    {/* Các bài học con */}
                                    {
                                        lecturessArray.map((lecture, index) => (
                                            <button
                                                onClick={() => (index > 0 && !completedLectures.includes(lecturessArray[index - 1].id)) ? null : handleClick(lecture)}
                                                key={lecture.id} className={`p-3 text-sm text-indigo-700 font-bold focus:bg-amber-500 border ${selected === lecture.id ? 'bg-amber-500' : 'bg-lime-100'} ${(index > 0 && !completedLectures.includes(lecturessArray[index - 1].id)) ? 'cursor-not-allowed opacity-50 ' : ''}`}
                                                disabled={(index > 0 && !completedLectures.includes(lecturessArray[index - 1].id))}
                                            >
                                                {lecture.title}
                                            </button>
                                        ))
                                    }
                                </div>

                                <div className="w-10/12 bg-lime-100 min-h-screen">
                                    <div ref={blocklyDiv} className={"border-2 h-screen"}></div>
                                    <div className="absolute right-0 top-72 m-4">
                                        <ButtonLearn onclick={runCode} />
                                    </div>
                                    <ToastContainer />
                                </div>
                            </div>
                            : basicEx ? <BasicEx /> : advancedEx ? <AdvancedEx /> : ""
                    }

                </div>
            </div>
            <Footer />
        </div >
    );
}

export default ExerciseStudy;