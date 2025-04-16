import PromptBox from "./PromptBox";

const PromptGroup = ({ onClick }) => {
  const prompts = [
    'What is ACF',
    'This is such a complex website, im so lost',
    'What is the difference in care in poverty vs neglect?',
    'I think I saw a child being trafficked?',
  ];

  return (
    <div className="flex flex-row flex-wrap justify-start items-center py-4 gap-2">
      {prompts.map((prompt, index) => (
        <PromptBox key={index} text={prompt} onClick={() => onClick(prompt)} />
      ))}
    </div>
  );
};

export default PromptGroup;
