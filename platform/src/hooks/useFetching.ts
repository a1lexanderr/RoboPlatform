import { useState } from "react"

export const useFetching = async (callback: () => void) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetching = async () => {
        try{
            setIsLoading(true);
            await callback();
    
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Unknown error');
            }
        } finally{
            setIsLoading(false);
    
        }
    }
    return [fetching, isLoading, error]

}