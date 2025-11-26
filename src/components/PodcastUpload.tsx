import { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const PodcastUpload = ({ channelId }: { channelId: string }) => {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title) {
      toast.error('Please provide a title and audio file');
      return;
    }

    try {
      setUploading(true);

      // Upload audio file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('podcasts')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('podcasts')
        .getPublicUrl(fileName);

      // Create podcast record
      const { data: user } = await supabase.auth.getUser();
      const { data: podcast, error: podcastError } = await supabase
        .from('podcasts')
        .insert({
          title,
          description,
          audio_url: publicUrl,
          channel_id: channelId,
          user_id: user.user?.id,
          is_published: false
        })
        .select()
        .single();

      if (podcastError) throw podcastError;

      toast.success('Podcast uploaded! Processing with AI...');
      setUploading(false);
      setProcessing(true);

      // Trigger AI processing
      const { error: processError } = await supabase.functions.invoke('process-podcast', {
        body: { podcastId: podcast.id }
      });

      if (processError) {
        console.error('Processing error:', processError);
        toast.warning('Upload successful, but AI processing failed. Podcast saved as draft.');
      } else {
        toast.success('Podcast processed and published!');
      }

      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      setProcessing(false);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Upload failed');
      setUploading(false);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <h3 className="text-xl font-bold text-white mb-4">Upload Podcast Episode</h3>
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Episode Title</label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Episode 1: Introduction"
          className="bg-slate-900/50 border-slate-700"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Description (Optional)</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description (AI will enhance this)"
          className="bg-slate-900/50 border-slate-700 min-h-[100px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Audio File</label>
        <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-cyan-500/50 transition-colors">
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            id="audio-upload"
          />
          <label htmlFor="audio-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-400">
              {file ? file.name : 'Click to upload audio file'}
            </p>
            <p className="text-xs text-slate-500 mt-1">MP3, WAV, or M4A (max 500MB)</p>
          </label>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={uploading || processing}
        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
      >
        {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {uploading ? 'Uploading...' : processing ? 'AI Processing...' : 'Upload & Process with AI'}
      </Button>

      {processing && (
        <div className="text-center text-sm text-slate-400">
          <p>🤖 AI is analyzing your podcast...</p>
          <p className="text-xs mt-1">Generating summary, extracting topics, creating SEO description</p>
        </div>
      )}
    </form>
  );
};
