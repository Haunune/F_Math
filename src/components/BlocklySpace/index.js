import { useEffect, useRef, useState } from 'react';
import { toolbox } from '../../blockly/toolbox';
import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import * as libraryBlocks from 'blockly/blocks';
import * as En from 'blockly/msg/en';
import ButtonLearn from "../../components/ButtonLearn";
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { child, get, ref } from 'firebase/database';
import { database } from '../../firebase/firebase';

Blockly.setLocale(En);

Blockly.defineBlocksWithJsonArray([
    {
        "type": "question_block",
        "message0": "Question: %1\n\n\nAnswer: %2",
        "args0": [
            {
                "type": "field_label_serializable",
                "name": "QUESTION",
                "text": "Your question here",
                "multiline": true
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

function BlocklySpace({ lesson, IdLectures }) {
    const blocklyDiv = useRef(null);
    const workspaceRef = useRef(null);
    const [workspace, setWorkspace] = useState(null);
    const [result, setResult] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [topic, setTopic] = useState([]);
    const dbRef = ref(database);

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

    useEffect(() => {
        get(child(dbRef, `lectures/${IdLectures.charAt(IdLectures.length - 1)}/lessons`)).then((snapshot) => {
            if (snapshot.exists()) {
                setLessons(Object.values(snapshot.val()));
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [dbRef])

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

    const notify = () => {
        if (result === topic.resultLecture) {
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

    useEffect(() => {
        setTopic(lesson);
        clearWorkspace();

        const newBlock = workspaceRef.current.newBlock('question_block');
        newBlock.setFieldValue(lesson.lecture_content, 'QUESTION');
        newBlock.initSvg();
        newBlock.render();
        workspaceRef.current.centerOnBlock(newBlock.id);
    }, [lesson])

    return (
        <div>
            <div className={"w-full translate-x-0 translate-y-"}>
                <div ref={blocklyDiv} className={"w-full border-2 h-screen"}></div>
                <div className="absolute right-0 top-0">
                    <ButtonLearn onclick={runCode} />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default BlocklySpace;