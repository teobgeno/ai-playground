class PromptParser:
    def generate_prompt(curr_input, prompt_lib_file):
        """
        Takes in the current input (e.g. comment that you want to classifiy) and 
        the path to a prompt file. The prompt file contains the raw str prompt that
        will be used, which contains the following substr: !<INPUT>! -- this 
        function replaces this substr with the actual curr_input to produce the 
        final promopt that will be sent to the GPT3 server. 
        ARGS:
        curr_input: the input we want to feed in (IF THERE ARE MORE THAN ONE
                    INPUT, THIS CAN BE A LIST.)
        prompt_lib_file: the path to the promopt file. 
        RETURNS: 
        a str prompt that will be sent to OpenAI's GPT server.  
        """
        if type(curr_input) == type("string"):
            curr_input = [curr_input]
        curr_input = [str(i) for i in curr_input]

        f = open(prompt_lib_file, "r")
        prompt = f.read()
        f.close()
        for count, i in enumerate(curr_input):
            prompt = prompt.replace(f"!<INPUT {count}>!", i)
        if "<commentblockmarker>###</commentblockmarker>" in prompt:
            prompt = prompt.split(
                "<commentblockmarker>###</commentblockmarker>")[1]
        return prompt.strip()

    def print_run_prompts(prompt_template=None,
                          persona=None,
                          gpt_param=None,
                          prompt_input=None,
                          prompt=None,
                          output=None):
        print(f"=== {prompt_template}")
        print("~~~ persona    ---------------------------------------------------")
        print(persona.name, "\n")
        print("~~~ gpt_param ----------------------------------------------------")
        print(gpt_param, "\n")
        print("~~~ prompt_input    ----------------------------------------------")
        print(prompt_input, "\n")
        print("~~~ prompt    ----------------------------------------------------")
        print(prompt, "\n")
        print("~~~ output    ----------------------------------------------------")
        print(output, "\n")
        print("=== END ==========================================================")
        print("\n\n\n")
