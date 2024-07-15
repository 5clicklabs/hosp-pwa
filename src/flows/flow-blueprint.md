1. Identify the Flow:

   - Determine the purpose and steps of the new flow (e.g., lab report retrieval, general inquiry).
   - List out all the stages the user will go through.

2. Create a New Flow Component:

   - Create a new file (e.g., `LabReportFlow.tsx` or `GeneralInquiryFlow.tsx`).
   - Set up the basic structure of a functional component.

3. Define State:

   - Use `useState` hooks for each piece of information you need to track.
   - Common states might include:
     ```typescript
     const [step, setStep] = useState<string>("initial");
     const [userInput, setUserInput] = useState<string>("");
     const [flowSpecificData, setFlowSpecificData] = useState<any>(null);
     ```

4. Create Step Functions:

   - For each step in your flow, create a function to handle that step.
   - Example:

     ```typescript
     const handleInitialStep = () => {
       // Logic for the first step
       setStep("next_step");
     };

     const handleNextStep = (input: string) => {
       // Process input and move to next step
       setFlowSpecificData(processInput(input));
       setStep("final_step");
     };
     ```

5. Implement AI Interaction:

   - If your flow requires AI interaction, use the `sendMessageToGPT` function from your hook.
   - Process the AI's response and update the flow accordingly.

6. Create UI Components:

   - For each step, create the necessary UI components.
   - These could be input forms, buttons, or displays of information.

7. Main Render Function:

   - Use a switch statement or conditional rendering to display the correct component for each step.
   - Example:
     ```typescript
     return (
       <div>
         {step === "initial" && (
           <InitialStepComponent onNext={handleInitialStep} />
         )}
         {step === "next_step" && (
           <NextStepComponent onSubmit={handleNextStep} />
         )}
         {step === "final_step" && (
           <FinalStepComponent data={flowSpecificData} />
         )}
       </div>
     );
     ```

8. Error Handling:

   - Implement try-catch blocks for async operations.
   - Use toast or other notification methods for user feedback.

9. Completion Logic:

   - Implement logic to determine when the flow is complete.
   - Call a completion function passed as a prop to return control to the main Chat component.

10. Integration with Main Chat:
    - In your main Chat component, conditionally render your new flow component when it's selected.
    - Pass necessary props like `addMessage` and `onFlowComplete`.

Here's a basic template you can use for new flows:

```typescript
import React, { useState } from "react";
import { useFrequentlyAskedOperations } from "@/hooks/frequent-ops";

interface NewFlowProps {
  addMessage: (message: Message) => void;
  onFlowComplete: () => void;
}

const NewFlow: React.FC<NewFlowProps> = ({ addMessage, onFlowComplete }) => {
  const [step, setStep] = useState<string>("initial");
  const [flowData, setFlowData] = useState<any>(null);
  const { sendMessageToGPT } = useFrequentlyAskedOperations();

  const handleInitialStep = async (input: string) => {
    try {
      const { response } = await sendMessageToGPT(input);
      addMessage({
        id: Date.now(),
        text: response,
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
      });
      setFlowData(processResponse(response));
      setStep("next_step");
    } catch (error) {
      console.error("Error in initial step:", error);
      // Handle error
    }
  };

  const handleNextStep = (input: string) => {
    // Process input and update flow
    setStep("final_step");
  };

  const handleCompletion = () => {
    // Perform any final actions
    onFlowComplete();
  };

  return (
    <div>
      {step === "initial" && (
        <InitialStepComponent onSubmit={handleInitialStep} />
      )}
      {step === "next_step" && (
        <NextStepComponent data={flowData} onNext={handleNextStep} />
      )}
      {step === "final_step" && (
        <FinalStepComponent onComplete={handleCompletion} />
      )}
    </div>
  );
};

export default NewFlow;
```

When implementing a new flow:

1. Copy this template and rename it appropriately.
2. Modify the steps and logic to fit the specific flow requirements.
3. Create the necessary UI components for each step.
4. Implement the required logic for processing user inputs and AI responses.
5. Ensure proper error handling and user feedback throughout the flow.

This approach should give you a solid foundation for creating new flows in your chat application, maintaining consistency and modularity across different features.
