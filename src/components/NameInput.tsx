import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// email validation
const validateEmail = (email: string) => {
  // Regex to validate for the email format
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailReg.test(email);
};

const NameInput = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [greeting, setGreeting] = useState("");
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("");
  const [age, setAge] = useState<string>(""); 
  const [ageError, setAgeError] = useState("");

  //const COLORS = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"];
  const COLORS: { [key: string]: string } = {
    "#f87171": "Red",
    "#60a5fa": "Blue",
    "#34d399": "Green",
    "#fbbf24": "Yellow",
    "#a78bfa": "Purple",
    "#fff": "White"
  };
  const [color, setColor] = useState("#fff"); // Bonus: Favorite Color

  // --- Bonus Feature: Load last name from localStorage on mount ---
  useEffect(() => {
    const lastEnteredName = localStorage.getItem("last-name-input");
    if (lastEnteredName) {
      setName(lastEnteredName);
      setGreeting(`Welcome back, ${lastEnteredName}!`);
    }
  }, []);

  // --- Validation Logic ---
  const validateName = (inputName: string): boolean => {
    const trimmedName = inputName.trim();
    if (trimmedName.length < 3) {
      setNameError("Name must be at least 3 characters.");
      return false;
    } else if (trimmedName.length > 30) {
      setNameError("Name must be no more than 30 characters.");
      return false
    }
    setNameError("");
    return true;
  };

  const validateAgeField = (inputAge: string): boolean => {
    // 年龄是必填项
    if (!inputAge.trim()) {
      setAgeError("Age is required.");
      return false;
    }

    const numericAge = parseInt(inputAge, 10);

    if (isNaN(numericAge)) {
      setAgeError("Age must be a number.");
      return false;
    }

    // 验证年龄范围 (13-120)
    if (numericAge < 13 || numericAge > 120) {
      setAgeError("Age must be between 13 and 120.");
      return false;
    }

    setAgeError("");
    return true;
  };

  const validateEmailField = (inputEmail: string): boolean => {
    // If optional field is empty, it's valid
    if (!inputEmail.trim()) {
      setEmailError("");
      return true;
    }

    if (!validateEmail(inputEmail)) {
      setEmailError("Please enter a valid email (must contain @ and .).");
      return false;
    }

    setEmailError("");
    return true;
  };

  // --- Handlers ---
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    // Real-time validation for name
    if (newName.trim().length >= 2) {
      setNameError("");
    }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAge = e.target.value.replace(/[^0-9]/g, ''); 
    setAge(newAge);
    if (newAge) {
        setAgeError("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // Real-time validation for email (optional, but good UX)
    if (newEmail.trim() && validateEmail(newEmail)) {
      setEmailError("");
    } else if (!newEmail.trim()) {
        setEmailError("");
    }
  };

  const handleSubmit = () => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmailField(email);
    const isAgeValid = validateAgeField(age);

    if (isNameValid && isEmailValid && isAgeValid) {
      const finalName = name.trim();
      const colorName = COLORS[color] || color;
      setGreeting(`Hello, ${finalName}! Welcome to data analysis! Your favorite color is ${colorName}.`);
      
      // Bonus Feature: Remember the last entered name
      localStorage.setItem("last-name-input", finalName);
    } else {
      // Re-run validation checks to show errors if fields were empty on submit
      validateName(name);
      validateEmailField(email);
      validateAgeField(age);
      setGreeting("");
    }
  };

  const handleClear = () => {
    setName("");
    setEmail("");
    setAge("");
    setColor("#fff");
    setNameError("");
    setAgeError("");
    setEmailError("");
    setGreeting("");
    // Optionally clear localStorage here, but requirement was only to "remember"
  };

  // --- Rendering ---
  const charCount = name.length; // Bonus: Character count

  return (
    <Card className="max-w-lg mx-auto shadow-xl" style={{background: color}}>
      <CardHeader>
        <CardTitle>Personalize Your Data Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* 1. Name Input Field */}
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Your Name (Required)
          </label>
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={handleNameChange}
            onBlur={() => validateName(name)} // Validate on loss of focus
            aria-invalid={!!nameError}
          />
          {/* Character Count Bonus */}
          <div className="flex justify-between">
            <p className="text-xs text-muted-foreground">{charCount} characters</p>
            {/* Name Error Message */}
            {nameError && (
              <p className="text-right text-red-600 text-sm">{nameError}</p>
            )}
          </div>
        </div>

        {/* 2. Age Input Field (Second Field Requirement) */}
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Your Age (Required, 13-120)
          </label>
          <Input
            type="text" // 使用 text 方便控制输入，但要求只输入数字
            placeholder="Enter your age (13-120)"
            value={age}
            onChange={handleAgeChange}
            onBlur={() => validateAgeField(age)}
            aria-invalid={!!ageError}
            maxLength={3}
          />
          {ageError && (
            <p className="text-right text-red-600 text-sm">{ageError}</p>
          )}
        </div>

        {/* 3. Email Input Field (Third Field Requirement) */}
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Your Email (Optional)
          </label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            onBlur={() => validateEmailField(email)} // Validate on loss of focus
            aria-invalid={!!emailError}
          />
          {/* Email Error Message */}
          {emailError && (
            <p className="text-right text-red-600 text-sm">{emailError}</p>
          )}
        </div>

        {/* ⭐️ Add UI：Color Dropdown */}
        <Select onValueChange={setColor} value={color}>
          <SelectTrigger>
            <SelectValue placeholder="Select a color" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(COLORS).map((hexCode) => (
              <SelectItem key={hexCode} value={hexCode}>
                {COLORS[hexCode]} ({hexCode})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Bonus: Favorite Color Dropdown */}
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">
            Favorite Color
          </label>
          {/* Color Picker */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-semibold">Pick a background color:</span>
          <div className="flex gap-2">
            {Object.keys(COLORS).map(color => (
              <button
                key={color}
                style={{ background: color, width: 32, height: 32, borderRadius: "50%", border: "2px solid #fff" }}
                onClick={() => setColor(color)} 
                aria-label={`Pick ${color}`}
              />
            ))}
          </div>
        </div>
        </div>


        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button onClick={handleSubmit} className="flex-1">
            Say Hello & Start
          </Button>
          {/* Clear Button Requirement */}
          <Button onClick={handleClear} variant="outline">
            Clear Form
          </Button>
        </div>

        {/* Greeting Message */}
        {greeting && (
          <p className="text-center bg-green-50 border border-green-200 p-3 rounded text-green-700 font-medium">
            {greeting}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default NameInput;
