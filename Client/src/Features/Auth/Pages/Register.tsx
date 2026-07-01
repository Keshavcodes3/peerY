import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../Hooks/useAuth"
import { OnboardingLayout } from "../Components/OnboardingLayout"
import { Step1Welcome } from "../Components/Steps/Step1Welcome"
import { Step2Identity } from "../Components/Steps/Step2Identity"
import { Step3Experience } from "../Components/Steps/Step3Experience"
import { Step4Intent } from "../Components/Steps/Step4Intent"
import { Step5Stack } from "../Components/Steps/Step5Stack"
import { Step6Skills } from "../Components/Steps/Step6Skills"
import { Step7Preview } from "../Components/Steps/Step7Preview"
import { INITIAL_DATA, type OnboardingData } from "../types/onboarding.types"
import { StoryView } from "../Components/LeftTypography/StoryView"
import { ProfileBuildView } from "../Components/LeftTypography/ProfileBuildView"
import { EvolutionView } from "../Components/LeftTypography/EvolutionView"
import { ConnectionView } from "../Components/LeftTypography/ConnectionView"
import { BuilderDashboardView } from "../Components/LeftTypography/BuilderDashboardView"
import { TechStackView } from "../Components/LeftTypography/TechStackView"

import { CompletionView } from "../Components/LeftTypography/CompletionView"
const TOTAL_STEPS = 7

export default function Register() {
    const [step, setStep] = useState(1)
    const [direction, setDirection] = useState(1)
    const [data, setData] = useState<OnboardingData>(INITIAL_DATA)
    const { register, isLoading, error } = useAuth()
    const navigate = useNavigate()

    const updateData = (updates: Partial<OnboardingData>) => {
        setData(prev => ({ ...prev, ...updates }))
    }

    const next = () => {
        setDirection(1)
        setStep(s => Math.min(s + 1, TOTAL_STEPS))
    }

    const back = () => {
        if (step === 1) return
        setDirection(-1)
        setStep(s => Math.max(s - 1, 1))
    }

    const handleSubmit = async () => {
        const success = await register({
            username: data.username,
            email: data.email,
            password: data.password
        })

        if (success) {
            navigate("/dashboard") // Or wherever they should go next
        }
    }

    const getRightContent = () => {
        switch (step) {
            case 1: return <Step1Welcome onNext={next} />;
            case 2: return <Step2Identity data={data} onChange={updateData} onNext={next} />;
            case 3: return <Step3Experience data={data} onChange={updateData} onNext={next} />;
            case 4: return <Step4Intent data={data} onChange={updateData} onNext={next} />;
            case 5: return <Step5Stack data={data} onChange={updateData} onNext={next} />;
            case 6: return <Step6Skills data={data} onChange={updateData} onNext={next} />;
            case 7: return <Step7Preview data={data} onSubmit={handleSubmit} isLoading={isLoading} error={error} />;
            default: return null;
        }
    }

    const getLeftContent = () => {
        switch (step) {
            case 1: return <StoryView />;
            case 2: return <ProfileBuildView />;
            case 3: return <EvolutionView />;
            case 4: return <ConnectionView />;
            case 5: return <TechStackView />;
            case 6: return <BuilderDashboardView />;
            case 7: return <CompletionView />;
            default: return null;
        }
    }

    return (
        <OnboardingLayout
            leftContent={getLeftContent()}
            rightContent={getRightContent()}
            step={step}
            direction={direction}
        />
    )
}
