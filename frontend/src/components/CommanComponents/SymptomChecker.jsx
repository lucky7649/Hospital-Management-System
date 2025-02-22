import React, { useState } from "react";
import { BeatLoader, RingLoader } from "react-spinners";
import Avatar from "react-avatar";
import { useSidePanel } from "../../context/sidePannelContext";
import { FaTimes } from "react-icons/fa";

function SymptomsChecker({ onBack }) {
  const { toggleSidePanel } = useSidePanel();
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello! I'm your friendly Symptom Checker Bot, here to assist you! I’ll guide you through a few quick steps to help you identify your symptoms and get the right advice.",
    },
    {
      sender: "bot",
      text: "Let’s start with something simple – could you please tell me your name?",
    },
  ]);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [finalResult, setFinalResult] = useState("");
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  // Handle user input submission
  //   const handleUserInput = async () => {
  //     if (!input.trim()) return; // Prevent empty input

  //     setMessages((prev) => [...prev, { sender: "user", text: input }]);

  //     if (step === 1) {
  //       setName(input);
  //       setMessages((prev) => [
  //         ...prev,
  //         { sender: "bot", text: `Nice to meet you, ${input}!` },
  //         { sender: "bot", text: "2️⃣ What is your age?" },
  //       ]);
  //       setStep(2);
  //     } else if (step === 2) {
  //       setAge(input);
  //       setMessages((prev) => [
  //         ...prev,
  //         { sender: "bot", text: "3️⃣ Select your gender: (Male / Female)" },
  //       ]);
  //       setStep(3);
  //     } else if (step === 3) {
  //       // Handle gender selection
  //       if (input.toLowerCase() === "male" || input.toLowerCase() === "female") {
  //         setGender(input);
  //         setMessages((prev) => [
  //           ...prev,
  //           { sender: "bot", text: `You selected: ${input}.` },
  //           {
  //             sender: "bot",
  //             text: "4️⃣ Please enter your symptoms (Type 'done' when finished):",
  //           },
  //         ]);
  //         setStep(4);
  //       } else {
  //         setMessages((prev) => [
  //           ...prev,
  //           {
  //             sender: "bot",
  //             text: "❌ Invalid gender. Please enter 'Male' or 'Female'.",
  //           },
  //         ]);
  //       }
  //     } else if (step === 4) {
  //       if (input.toLowerCase() === "done") {
  //         setMessages((prev) => [
  //           ...prev,
  //           { sender: "bot", text: "🔍 Analyzing your symptoms..." },
  //         ]);
  //         await checkSymptoms();
  //       } else {
  //         setSymptoms((prev) => [...prev, input]);
  //         setMessages((prev) => [
  //           ...prev,
  //           {
  //             sender: "bot",
  //             text: "Add more symptoms or type 'done' to finish:",
  //           },
  //         ]);
  //       }
  //     }

  //     setInput(""); // Clear input field after submission
  //   };
  const handleUserInput = async () => {
    if (!input.trim()) return; // Prevent empty input

    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    setIsThinking(true); // Start loading animation

    // Simulate a delay for the AI to "think"
    setTimeout(async () => {
      if (step === 1) {
        setName(input);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `Nice to meet you, ${input}!` },
          { sender: "bot", text: " What is your age?" },
        ]);
        setStep(2);
      } else if (step === 2) {
        setAge(input);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: " Select your gender: (Male / Female)" },
        ]);
        setStep(3);
      } else if (step === 3) {
        // Handle gender selection
        if (
          input.toLowerCase() === "male" ||
          input.toLowerCase() === "female"
        ) {
          setGender(input);
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: `You selected: ${input}.` },
            {
              sender: "bot",
              text: "Please enter your symptoms",
            },
          ]);
          setStep(4);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: "Invalid gender. Please enter 'Male' or 'Female'.",
            },
          ]);
        }
      } else if (step === 4) {
        if (input.toLowerCase() === "done") {
          // Add analyzing message and wait for response
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: " Analyzing your symptoms..." },
          ]);

          // Perform the symptom check and get results
          await checkSymptoms();

          // Remove the "Analyzing" message once the result is received
          setMessages((prev) =>
            prev.filter((msg) => msg.text !== " Analyzing your symptoms...")
          );
        } else {
          setSymptoms((prev) => [...prev, input]);
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: "Add more symptoms or type 'done' to finish:",
            },
          ]);
        }
      }
      setInput("");
      setIsThinking(false); // End loading animation
      // Clear input field after submission
    }, 2000); // Adjust delay (2000ms = 2 seconds)
  };

  // API call to check symptoms
  const checkSymptoms = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:1000/api/v1/check-symptoms",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ age, gender, symptoms }),
        }
      );
      const data = await response.json();
      setFinalResult(data.response);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "✅ Symptoms analysis complete! Here's the result:",
        },
        { sender: "bot", text: `✅ Diagnosis: ${data.response}` },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error analyzing symptoms." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex relative justify-center items-center h-screen bg-gray-100">
      <button
        onClick={onBack}
        className="flex absolute top-4 left-4 p-2 bg-blue-500   items-center text-white hover:bg-bluemb-4"
      >
        Back
      </button>
      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center mb-2">
          <Avatar
            name="bot"
            src="./assets/bot-avatar.png"
            className="rounded-full shadow-md object-cover"
            size="40"
          />{" "}
          AI Health assistant
        </h2>
        <div className="h-[60vh] overflow-y-auto p-2 border border-gray-300 rounded">
          {messages.map((msg, index) => (
            <div key={index} className="flex gap-2 justify-start mb-2">
              {msg.sender === "bot" ? (
                <>
                  <Avatar
                    name="bot"
                    src="./assets/bot-avatar.png"
                    className="rounded-full mt-1 shadow-md object-cover"
                    size="30"
                  />
                  <div className="p-2 min-w-6 max-w-xs bg-blue-500 text-white rounded-lg">
                    {msg.text}
                  </div>
                </>
              ) : (
                <div className="flex gap-2 self-end ml-auto">
                  <div className="p-2 max-w-xs bg-green-400 text-white rounded-lg ">
                    {msg.text}
                  </div>
                  <Avatar
                    name="bot"
                    src="./assets/user-avatar.png"
                    className="rounded-full mt-1 shadow-md object-cover"
                    size="30"
                  />
                </div>
              )}
            </div>
          ))}
          {isThinking && (
            <div className="p-2 my-1 w-1/2 bg-blue-200 self-start rounded-lg text-center">
              <BeatLoader color="#ffffff" size={8} />
            </div>
          )}
        </div>

 
        {!loading && (
          <div className="mt-2 flex items-center">
            {step === 3 ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setInput("Male");
                    handleUserInput();
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Male
                </button>
                <button
                  onClick={() => {
                    setInput("Female");
                    handleUserInput();
                  }}
                  className="px-4 py-2 bg-pink-500 text-white rounded"
                >
                  Female
                </button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  placeholder={
                    step === 1
                      ? "Enter your name"
                      : step === 2
                      ? "Enter your age"
                      : "Enter symptoms or type 'done'"
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUserInput()}
                />
                <button
                  onClick={handleUserInput}
                  className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
                >
                  Send
                </button>
              </>
            )}
          </div>
        )}

        {loading && <p className="text-center text-gray-500">⏳ Checking...</p>}
      </div>
    </div>
  );
}

export default SymptomsChecker;
