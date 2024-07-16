class PromptParser:
    def generate_prompt(self, prompt_lib_file, curr_input):
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
        # if type(curr_input) == type("string"):
        #     curr_input = [curr_input]
        # curr_input = [str(i) for i in curr_input]

        f = open(prompt_lib_file, "r")
        prompt = f.read()
        f.close()
        for count in curr_input:
            prompt = prompt.replace(
                f"!<INPUT {count['keyword']}>!", count["value"])
        if "<commentblockmarker>###</commentblockmarker>" in prompt:
            prompt = prompt.split(
                "<commentblockmarker>###</commentblockmarker>")[1]
        return prompt.strip()

    def print_run_prompts(self, prompt_template=None,
                          gpt_param=None):
        print("~~~ prompt_template ----------------------------------------------")
        print(prompt_template, "\n")
        print("~~~ gpt_param ----------------------------------------------------")
        print(gpt_param, "\n")
        print("=== END ==========================================================")
        print("\n\n\n")
