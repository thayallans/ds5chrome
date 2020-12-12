const setupDualSenseController = () => {
    const buttonCount = 17;
    const axis = 10;

    const emulatedDualSense = {
        id: "DualSense 5 Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)",
        index: 0,
        connected: true,
        timestamp: 0,
        mapping: "standard",
        axes: [0, 0, 0, 0],
        buttons: new Array(buttonCount).fill().map(m => ({pressed: false, touched: false, value: 0}))
    }
    let pressedButton;
    let unpressedButton;

    const initialGetGamepads = navigator.getGamepads;
    navigator.getGamepads = function() {
        const initialGamepads = initialGetGamepads.apply(navigator);
        let dualsenseIndex = 5;
        for (let index = 0; index < 4; index++) {
            if (initialGamepads[index] !== null && ((initialGamepads[index].id == "Wireless Controller (Vendor: 054c Product: 0ce6)") || (initialGamepads[index].id == "DUALSHOCK 4 Wireless Controller (Vendor: 054c Product: 0ce6)"))) {
                dualsenseIndex = index;
                emulatedDualSense.index = dualsenseIndex;
            }
        }

        if (dualsenseIndex == 5) {
            return initialGamepads;
        }
        for(let button = 0; button < buttonCount; button++){
            if (initialGamepads[dualsenseIndex] && initialGamepads[dualsenseIndex].buttons[button]) {
                // Buttons 0,1,2 are all messed up so here's how we re-map them correctly
                if (button == 0) {
                    emulatedDualSense.buttons[2] = initialGamepads[dualsenseIndex].buttons[button];
                    emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
                } else if (button == 1) {
                    emulatedDualSense.buttons[0] = initialGamepads[dualsenseIndex].buttons[button];
                    emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
                } else if (button == 2) {
                    emulatedDualSense.buttons[1] = initialGamepads[dualsenseIndex].buttons[button];
                    emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
                } else {
                    emulatedDualSense.buttons[button] = initialGamepads[dualsenseIndex].buttons[button];
                    emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
                }
            }

            // Can't seem to create GamepadButton so just storing a preseed and unpressed button press to use later on
            if (emulatedDualSense.buttons[button].pressed && !pressedButton) {
                pressedButton = emulatedDualSense.buttons[button];
            } else if (!emulatedDualSense.buttons[button].pressed && !unpressedButton) {
                unpressedButton = emulatedDualSense.buttons[button];
            }
        }

        for(let currentAxis = 0; currentAxis < axis; currentAxis++){
            if (initialGamepads[dualsenseIndex] && initialGamepads[dualsenseIndex].axes[currentAxis]) {
                if (currentAxis > 2) {
                    if (currentAxis == 9) {
                        // DPad is Mapped to an Axis... this converts the axis into the DPad Values
                        if (initialGamepads[dualsenseIndex].axes[currentAxis] == 1.2857143878936768) {
                            // Reset all DPad Values
                            emulatedDualSense.buttons[12] = unpressedButton;
                            emulatedDualSense.buttons[13] = unpressedButton;
                            emulatedDualSense.buttons[14] = unpressedButton;
                            emulatedDualSense.buttons[15] = unpressedButton;
                        } else if (initialGamepads[dualsenseIndex].axes[currentAxis] == 0.14285719394683838) {
                            if (pressedButton) {
                                emulatedDualSense.buttons[13] = pressedButton;
                                emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
                            }
                        } else if (initialGamepads[dualsenseIndex].axes[currentAxis] == -0.4285714030265808) {
                            if (pressedButton) {
                                emulatedDualSense.buttons[15] = pressedButton;
                                emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
                            }
                        } else if (initialGamepads[dualsenseIndex].axes[currentAxis] == 0.7142857313156128) {
                            if (pressedButton) {
                                emulatedDualSense.buttons[14] = pressedButton;
                                emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
                            }
                        } else if (initialGamepads[dualsenseIndex].axes[currentAxis] == -1) {
                            if (pressedButton) {
                                emulatedDualSense.buttons[12] = pressedButton;
                                emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
                            }
                        }
                    } else if (currentAxis == 5) {
                        emulatedDualSense.axes[3] = Math.min(Math.max((initialGamepads[dualsenseIndex].axes[currentAxis] * 1), -1), 1);
                        emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
                    }
                } else {
                    emulatedDualSense.axes[currentAxis] = Math.min(Math.max((initialGamepads[dualsenseIndex].axes[currentAxis] * 1), -1), 1);
                    emulatedDualSense.timestamp = initialGamepads[dualsenseIndex].timestamp;
                }
            }
        }

        // Only Apply Emulated Controller on DS5 Controllers
        let newGamepads = []
        for (let index = 0; index < 4; index++) {
            if (index == dualsenseIndex) {
                newGamepads[dualsenseIndex] = emulatedDualSense
            } else {
                newGamepads[index] = initialGamepads[index];
            }
        }
        return newGamepads;
    }
}

const injectSetupScript = () => {
    const injScript = document.createElement("script");
    injScript.appendChild(document.createTextNode("(" + setupDualSenseController + ")();"));
    (document.body || document.head || document.documentElement).appendChild(injScript);
}

injectSetupScript();
