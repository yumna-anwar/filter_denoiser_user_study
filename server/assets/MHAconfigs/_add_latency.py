import sys
from pydub import AudioSegment
#from pydub.generators import Silence

def add_latency(audio_segment, latency_ms, interval_ms):
    new_audio = AudioSegment.empty()
    silence = AudioSegment.silent(duration=latency_ms)
    segments = len(audio_segment) // interval_ms

    for i in range(segments):
        start = i * interval_ms
        end = start + interval_ms
        new_audio += audio_segment[start:end] + silence

    # Add any remaining audio at the end
    if len(audio_segment) % interval_ms > 0:
        new_audio += audio_segment[-(len(audio_segment) % interval_ms):]

    return new_audio
def add_initial_buffer(audio_segment, latency_ms):
    """Adds an initial buffering period to the audio segment."""
    buffer = AudioSegment.silent(duration=latency_ms)
    return buffer + audio_segment

def add_streaming_latency(audio_segment, latency_ms, interval_ms):
    """Adds intermittent latency to simulate streaming effects."""
    new_audio = AudioSegment.empty()
    silence = AudioSegment.silent(duration=latency_ms)
    segments = len(audio_segment) // interval_ms

    for i in range(segments):
        start = i * interval_ms
        end = start + interval_ms
        new_audio += audio_segment[start:end] + silence

    # Add any remaining audio at the end
    if len(audio_segment) % interval_ms > 0:
        new_audio += audio_segment[-(len(audio_segment) % interval_ms):]

    return new_audio
if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python script.py <file1> <file2> <output_filename> <latency_ms>")
        sys.exit(1)

    # Parse command-line arguments
    file1_path = sys.argv[1]
    file2_path = sys.argv[2]
    output_filename = sys.argv[3]
    initial_latency_ms = int(sys.argv[4])
    streaming_latency_ms = 40#int(sys.argv[5])

        # Load the audio files
    audio1 = AudioSegment.from_file(file1_path)

    # Add an initial buffering period (constant delay)
    audio1_with_initial_buffer = add_initial_buffer(audio1, initial_latency_ms)
    
    # Add intermittent streaming latency
    audio1_with_streaming_latency = add_streaming_latency(audio1_with_initial_buffer, streaming_latency_ms, 1000)  # Example: 1000ms interval

    # Load the second audio file
    audio2 = AudioSegment.from_file(file2_path)

    # Combine the modified first audio file with the second audio file
    # combined_audio = audio1_with_latency + audio2
    combined_audio = audio1_with_streaming_latency.overlay(audio2)

    # Export the combined audio file
    combined_audio.export(output_filename, format="wav")

    print(f"Combined audio file saved as {output_filename}")

