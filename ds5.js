console.log("YEYE BITCHES")

const setupDualSenseController = () => {
    const buttonCount = 17;
    const axis = 4;

    const emulatedDualSense = {
        id: "DualSense 5 Controller",
        index: 0,
        connected: true,
        timestamp: 0,
        mapping: "standard",
        axes: [0, 0, 0, 0],
        buttons: new Array(buttonCount).fill().map(m => ({pressed: false, touched: false, value: 0}))
    }
    const initialGetGamepads = navigator.getGamepads;
    navigator.getGamepads = function() {
        const initialGamepads = initialGetGamepads.apply(navigator);
        for(let button = 0; button < buttonCount; button++){
            if (initialGamepads[0] && initialGamepads[0].buttons[button]) {
                if (button == 0) {
                    emulatedDualSense.buttons[2] = initialGamepads[0].buttons[button];
                    emulatedDualSense.timestamp = initialGamepads[0].timestamp;
                } else if (button == 1) {
                    emulatedDualSense.buttons[0] = initialGamepads[0].buttons[button];
                    emulatedDualSense.timestamp = initialGamepads[0].timestamp;
                } else if (button == 2) {
                    emulatedDualSense.buttons[1] = initialGamepads[0].buttons[button];
                    emulatedDualSense.timestamp = initialGamepads[0].timestamp;
                } else {
                    emulatedDualSense.buttons[button] = initialGamepads[0].buttons[button];
                    emulatedDualSense.timestamp = initialGamepads[0].timestamp;
                }
            }
        }
        return [emulatedDualSense, null, null, null]
    }
}

const injectSetupScript = () => {
    const injScript = document.createElement("script");
    injScript.appendChild(document.createTextNode("(" + setupDualSenseController + ")();"));
    (document.body || document.head || document.documentElement).appendChild(injScript);
}

injectSetupScript();
