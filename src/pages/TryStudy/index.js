import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import * as Blockly from 'blockly/core';
import * as libraryBlocks from 'blockly/blocks';
import {javascriptGenerator} from 'blockly/javascript';
import * as En from 'blockly/msg/en';
import { useRef } from "react";
import { toolbox } from "../../blockly/toolbox";
import { blocks } from "../../blockly/json";

Blockly.setLocale(En);
Blockly.common.defineBlocks(blocks);

function TryStudy() {
    const workspace = Blockly.inject('blocklyDiv', {toolbox: toolbox});

    javascriptGenerator.forBlock['my_custom_block'] = function(block, generator) {
        const steps = block.getFieldValue('FIELD_NAME');
        return `moveForward(${steps});\n`;
      }

    const runCode = () => {
        const code = javascriptGenerator.workspaceToCode(workspace);

        return code
      };


    return (
        <div>
            <Header />
            <Navbar />
            <div class="min-h-screen bg-navbar">
                <div id="blocklyDiv"class="border-2 w-1/5 min-h-screen"></div>
            </div>
            <Footer />
        </div>
    );
}

export default TryStudy;