import sys
from pydub import AudioSegment

def add_initial_buffer(audio_segment, latency_ms):
    """Adds an initial buffering period to the audio segment."""
    buffer = AudioSegment.silent(duration=latency_ms)
    return buffer + audio_segment

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python script.py <file1> <file2> <output_filename> <latency_ms>")
        sys.exit(1)

    # Parse command-line arguments
    file1_path = sys.argv[1]
    file2_path = sys.argv[2]
    output_filename = sys.argv[3]
    initial_latency_ms = int(sys.argv[4])

    # Load the audio files
    audio1 = AudioSegment.from_file(file1_path)

    # Add an initial buffering period (constant delay) at the start
    audio1_with_initial_buffer = add_initial_buffer(audio1, initial_latency_ms)
    
    # Load the second audio file
    audio2 = AudioSegment.from_file(file2_path)

    # Combine the modified first audio file with the second audio file
    combined_audio = audio1_with_initial_buffer.overlay(audio2)

    # Export the combined audio file
    combined_audio.export(output_filename, format="wav")

    print(f"Combined audio file saved as {output_filename}")