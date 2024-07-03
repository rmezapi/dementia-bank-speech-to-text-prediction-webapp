import { redirect } from "@remix-run/node";



export async function sendToModelAPI(transcript: string) {
    console.log('Sending to model API:', transcript);
    redirect(`/diagnosis?diagnosis=${transcript}`);
    // try {
    //   const response = await fetch('/your-model-api-endpoint', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ transcript }),
    //   });
      
    //   if (!response.ok) {
    //     throw new Error('Model API request failed');
    //   }
      
    //   const result = await response.json();
    //   console.log('Model API result:', result);
    //   return result;
    // } catch (error) {
    //   console.error('Error sending to model API:', error);
    //   throw error;
    // }
    return (
        <p>{transcript}</p>
    )
  }