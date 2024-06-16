import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import * as Blockly from 'blockly/core';
import * as libraryBlocks from 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';
import * as En from 'blockly/msg/en';
import { useEffect, useRef } from "react";
import { toolbox } from "../../blockly/toolbox";

Blockly.setLocale(En);
function TryStudy() {
    const blocklyDiv = useRef(null);
    const workspaceRef = useRef(null)

    useEffect(() => {
        if (blocklyDiv.current) {

            // cleanup để tránh bị render trùng lặp
            // if (workspaceRef.current) {
            //     workspaceRef.current.dispose();
            // }
            workspaceRef.current = Blockly.inject(blocklyDiv.current, {
                toolbox: toolbox,
                toolboxPosition: "start",         
            });


            // javascriptGenerator.forBlock['my_custom_block'] = function (block, generator) {
            //     const steps = block.getFieldValue('FIELD_NAME');
            //     return `moveForward(${steps});\n`;
            // }

            const runCode = () => {
                const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
                return code;
            };
        }

        return () => {
            if (workspaceRef.current) {
                workspaceRef.current.dispose();
                workspaceRef.current = null;
            }
        };

    }, []);

    return (
        <div>
            <Header />
            <Navbar />
            <div className={"bg-navbar min-h-screen translate-x-0 translate-y-0"}>
                <div ref={blocklyDiv} className={"absolute border-2 w-screen h-screen "}></div>
            </div>
            <Footer />
        </div>
    );
}

export default TryStudy;