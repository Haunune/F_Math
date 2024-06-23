import { useEffect, useRef, useState } from 'react';
import { toolbox } from '../../blockly/toolbox';
import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import * as libraryBlocks from 'blockly/blocks';
import * as En from 'blockly/msg/en';
import ButtonLearn from "../../components/ButtonLearn";
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Blockly.setLocale(En);

function BlocklySpace({lesson}) {
    const blocklyDiv = useRef(null);
    const workspaceRef = useRef(null);
    const [workspace, setWorkspace] = useState(null);
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (blocklyDiv.current) {
            workspaceRef.current = Blockly.inject(blocklyDiv.current, {
                toolbox: toolbox,  
                collapse: true,              
                scrollbars: false
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

    return (
        <div>
            <div className="w-full h-16 p-3 text-xl font-semibold"><span className='font-bold text-2xl'>Topic: </span>{lesson.lecture_content}</div>
            <div className={"w-full translate-x-0 translate-y-0 overflow-hidden"}>
                <div ref={blocklyDiv} className={"w-full border-2 h-screen overflow-hidden"}></div>
                <div className="absolute right-0 top-0">
                    <ButtonLearn onclick={runCode} />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default BlocklySpace;