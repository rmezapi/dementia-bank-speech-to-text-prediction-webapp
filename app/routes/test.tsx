import { ActionFunctionArgs, json } from '@remix-run/node';
import { 
  Button, 
  Image } from "@nextui-org/react";
import globalStyles from "~/styles/Global.css";
import React, { useState, useRef, useEffect } from 'react';
import { SubmitRecordingButton } from "~/components/SubmitRecording";
import { c } from 'vite/dist/node/types.d-aGj9QkWt';
import { useFetcher } from '@remix-run/react';

const AudioRecorderComponent: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [recordingStatus, setRecordingStatus] = useState<string>('');

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('MediaDevices API or getUserMedia not supported.');
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          setAudioBlob(audioBlob);
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
          setRecordingStatus('Recording stopped');
          audioChunksRef.current = []; // Reset the chunks array
        };
      })
      .catch(error => console.error('Error accessing media devices.', error));
  }, []);

  const startRecording = () => {
    if (mediaRecorder) {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      audioChunksRef.current = []; // Reset the chunks array
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingStatus('Recording...');
      console.log('started recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setRecordingStatus('Processing recording...');
      console.log('stopped recording');
    }
  };

  return (
    <div>
      <Button onClick={startRecording} disabled={isRecording}>Start Recording</Button>
      <Button onClick={stopRecording} disabled={!isRecording}>Stop Recording</Button>
      {audioUrl && <audio ref={audioRef} controls src={audioUrl} />}
      <p>{recordingStatus}</p>
      {/* {recordingStatus === 'Recording stopped' && audioBlob && <SubmitRecording />} */}
      {recordingStatus === 'Recording stopped' && audioBlob && (
        <>
          <SubmitRecordingButton audioBlob={audioBlob} />
        </>
      )}

    </div>
  );
}


export function links() {
  return [{ rel: "stylesheet", href: globalStyles }];
}

// Import the createClient function only on the server side
let deepgramClient: any;
if (typeof window === 'undefined') {
  const { createClient } = require('@deepgram/sdk');
  deepgramClient = createClient(process.env.DEEPGRAM_API_KEY as string);
}

// Define the shape of the action response
type ActionData = {
  transcript?: string;
  error?: string;
};

// Export the action function
export const action = async ({ request }: ActionFunctionArgs): Promise<ReturnType<typeof json<ActionData>>> => {
  console.log('action')
  const formData = await request.formData();
  const audioFile = formData.get('audio') as File;

  if (!audioFile) {
    return json<ActionData>({ error: 'No audio file provided' }, { status: 400 });
  }
  console.log('Audio file received:', audioFile.name, audioFile.type, audioFile.size);

  try {
    console.log('Calling Deepgram API');
    const response = await deepgramClient.listen.prerecorded.transcribeFile(audioFile, {
      smart_format: true,
      model: 'general',
    });
    console.log('Deepgram API response:', JSON.stringify(response, null, 2));
    const transcript = response.result.results.channels[0].alternatives[0].transcript;
console.log('Transcription result:', transcript);
	  console.log('success')
    if (!transcript) {
      console.log('Transcript is undefined');
      return json<ActionData>({ error: 'Transcription failed - no transcript returned' }, { status: 500 });
    }
	  return json<ActionData>({ transcript });    
  } catch (error) {
    console.error('Transcription error:', error);
    console.log('fail')
    return json<ActionData>({ error: 'Transcription failed' }, { status: 500 });
  }
};

export default function Test() {
  return (
    <div>
      <h1>Dementia Detection Test</h1>
      {/* Add your test content here */}
      <Image
        width={500}
        alt="Cookie Theft Test"
        src="/images/cookie.png"
        className="mb-4"
      />
      <h3> Instructions: </h3>
      <p> Describe everything you see in the image in an audio recording.</p>
      <p> Click on the 'RECORD' button below to begin recording </p>
      <p> When done, click the 'SUBMIT' button below</p>

      {/* <Button
        as={Link}
        to=""
        color="primary"
        size="lg"
        className="record-btn"
      >
        Record
      </Button> */}
      <AudioRecorderComponent />

      
    </div>
  );
}