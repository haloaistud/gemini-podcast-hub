import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

interface PodcastPlayerProps {
  title: string;
  artist: string;
  audioUrl: string;
  thumbnailUrl?: string;
  onLike?: () => void;
  isLiked?: boolean;
}

export const PodcastPlayer = ({ 
  title, 
  artist, 
  audioUrl, 
  thumbnailUrl,
  onLike,
  isLiked = false 
}: PodcastPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeat]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(false);
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(currentTime + 15, duration);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(currentTime - 15, 0);
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="glass-strong p-6 space-y-6 rounded-3xl border-2 border-white/20 glow-primary">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Podcast Info */}
      <div className="flex items-center gap-4">
        {thumbnailUrl && (
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <img 
              src={thumbnailUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white truncate">{title}</h3>
          <p className="text-sm text-muted-foreground truncate">{artist}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onLike}
          className={`rounded-full transition-smooth ${isLiked ? 'text-warning' : 'text-muted-foreground'}`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleTimeChange}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsShuffle(!isShuffle)}
            className={`rounded-full transition-smooth ${isShuffle ? 'text-accent' : 'text-muted-foreground'}`}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={skipBackward}
            className="rounded-full hover:bg-white/10"
          >
            <SkipBack className="w-5 h-5" />
          </Button>
          
          <Button
            onClick={togglePlayPause}
            size="icon"
            className="w-14 h-14 rounded-full bg-gradient-primary hover:glow-primary transition-smooth"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={skipForward}
            className="rounded-full hover:bg-white/10"
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsRepeat(!isRepeat)}
            className={`rounded-full transition-smooth ${isRepeat ? 'text-accent' : 'text-muted-foreground'}`}
          >
            <Repeat className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
          className="rounded-full flex-shrink-0"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground w-8 text-right">
          {isMuted ? 0 : volume}%
        </span>
      </div>
    </Card>
  );
};
