import express from 'express';
import podcastsRoutes from './api/routes/podcasts.routes.js';
const app=express();
app.use(express.json());
app.use('/uploads',express.static('./uploads'));
app.use('/transcripts',express.static('./transcripts'));
app.use('/api/podcasts',podcastsRoutes);
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log(`Backend running on http://localhost:${PORT}`));
