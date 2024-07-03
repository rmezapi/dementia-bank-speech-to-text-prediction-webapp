import { useState, useEffect, useRef } from 'react';
import { Button } from '@nextui-org/react';
import { SubmitRecordingButton } from './SubmitRecordingButton';

export const AudioRecorder: React.FC = () => {
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