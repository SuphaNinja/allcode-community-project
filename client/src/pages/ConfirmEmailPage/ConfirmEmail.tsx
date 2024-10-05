import axiosInstance from "@/lib/axiosInstance"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent,} from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface ParamsProps {
    token?: string
    username?: string
}

export default function ConfirmEmail() {
    const { token, username } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const { toast } = useToast()

    const verify = useMutation({
        mutationFn: (data: ParamsProps) => axiosInstance.post("/api/auth/confirm-email", data),
        onSuccess: (data) => {
            if (data.data.token) {
                localStorage.setItem("token", data.data.token)
            }
            
            toast({
                title: `Welcome ${username}!`,
                description: <p className="text-white">Your email has been verified.</p>,
                duration: 1500,
            })
            setTimeout(() => {
                navigate("/")
                window.location.reload()
            }, 1000);
            
        },
    })

    useEffect(() => {
        if (token && username && token !== "1" && username !== "1") {
            verify.mutate({ token, username })
        }
    }, [token, username, verify])

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="flex items-center justify-center min-h-screen  p-4">
            <Card className="w-full rounded-xl max-w-md">
                <CardContent className="">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-6">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="mt-4 text-lg font-medium text-muted-foreground">Verifying...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                            {verify.isIdle && (
                                <div className="space-y-2">
                                    <p className="text-lg font-medium text-primary">Check your inbox and verify your email</p>
                                    <p className="text-sm text-muted-foreground">You may now close this page</p>
                                </div>
                            )}
                            {verify.isError && (
                                <div className="space-y-2">
                                    <p className="text-lg font-medium text-destructive">Error confirming email</p>
                                    <p className="text-sm text-muted-foreground">{verify.error.message}</p>
                                </div>
                            )}
                            {verify.isSuccess && (
                                <div className="space-y-2">
                                    <p className="text-lg font-medium text-primary">Email confirmed successfully!</p>
                                    <p className="text-sm text-muted-foreground">Redirecting...</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}