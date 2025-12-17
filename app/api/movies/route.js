
import { NextResponse } from 'next/server';

export async function GET(request) {

  const { searchParams } = new URL(request.url);
  const genreId = searchParams.get('genre');

  if (!genreId) {
    return NextResponse.json({ error: 'Genre ID is required' }, { status: 400 });
  }
  const randomPage = Math.floor(Math.random() * 500) + 1;

  const res = await fetch(
    `${process.env.TMDB_API_URL}/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=${randomPage}`
  );

  if (!res.ok) {

    return NextResponse.json({ error: 'Failed to fetch from TMDB' }, { status: res.status });
  }
  
  const data = await res.json();
  

  return NextResponse.json(data.results);
}