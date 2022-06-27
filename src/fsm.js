class FSM {
    #initial;
    #transitions;

    #events;

    #step;

    #history;

    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config) {

            if (config.states) {
                this.#transitions = config.states;
                this.#events = Object.entries(config.states).reduce((acc, [state,val]) => {
                    const flatData = Object.entries(val.transitions).reduce((inAcc, inVal)=> { inAcc[inVal[0]]= state; return inAcc;},{})
                    for (let key in flatData) {
                        acc[key] ? acc[key].push(flatData[key]) : acc[key] = [flatData[key]]
                    }
                    return acc;
                }, {})


            } else {
                throw new Error('no states');
            }

            if (config.initial && this.isValidState(config.initial)) {

                this.#initial = config.initial;
            } else {
                throw new Error('no initial state');
            }

           this.clearHistory();


        } else {
            throw new Error('no way')
        }
    }

    isValidState(state) {
        return !!this.#transitions[state];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return  this.#history[this.#step].state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        const newState = this.#transitions[state]
        if (newState) {
            this.#step += 1;
            this.#history = { ...this.#history, [this.#step]: { state: state } }
        } else {
            throw new Error('change state error');
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        const newState = this.#transitions[this.getState()].transitions[event];
        if (newState) {
            this.#step += 1;
            this.#history = { ...this.#history, [this.#step]: { state: newState } }
        } else {
            throw new Error('trigger error')
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.#step = 0;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (event) {
            return this.#events[event] ? this.#events[event] : [];
        } else {
            return Object.keys(this.#transitions);
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.#step === 0) {
            return false;
        }


        this.#step -= 1;

        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.#step === 0 && !this.#history[this.#step + 1]) {
            return false;
        }

        if (!this.#history[this.#step + 1]) {
            return false;
        }


        this.#step += 1;

        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.#step = 0;
        this.#history = { 0: { state: this.#initial }}
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
