export interface OnboardingData {
    // Step 1 - Auth
    authMethod?: "google" | "github" | "email"

    // Step 2 - Identity
    username: string
    gender: string
    email: string
    password: string

    // Step 3 - Experience
    experience: "beginner" | "intermediate" | "advanced" | ""

    // Step 4 - Intent
    intents: string[]

    // Step 5 - Tech Stack
    stack: string[]

    // Step 6 - Skills
    skills: string[]
}

export const INITIAL_DATA: OnboardingData = {
    username: "",
    gender: "",
    email: "",
    password: "",
    experience: "",
    intents: [],
    stack: [],
    skills: [],
}
