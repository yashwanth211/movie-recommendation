"use client";

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

const genres = [
  { name: 'Action', id: 28 },
  { name: 'Comedy', id: 35 },
  { name: 'Horror', id: 27 },
  { name: 'Sci-Fi', id: 878 },
  { name: 'Romance', id: 10749 },
];

const getImageUrl = (path) => `https://image.tmdb.org/t/p/w500${path}`;

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genreSelected, setGenreSelected] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getMovies = async (genreId) => {
    setLoading(true);
    setGenreSelected(true);
    setMovies([]);
    setCurrentIndex(0);

    try {
      const res = await fetch(`/api/movies?genre=${genreId}`);
      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }
      const data = await res.json();
      setMovies(data);

    } catch (error) {
      console.error("Failed to fetch movies:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < movies.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  const resetApp = () => {
    setMovies([]);
    setGenreSelected(false);
    setCurrentIndex(0);
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>Finding movies...</h1>
      </main>
    );
  }

  if (!genreSelected) {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>What genre are you feeling?</h1>
        <div className={styles.genrePicker}>
          {genres.map((genre) => (
            <button 
              key={genre.id} 
              className={styles.genreButton}
              onClick={() => getMovies(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </main>
    );
  }

  if (genreSelected && !loading && movies.length === 0) {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>No movies found!</h1>
        <button onClick={resetApp} className={styles.genreButton}>
          Try another genre?
        </button>
      </main>
    );
  }

  if (genreSelected && !loading && movies.length > 0) {
    const currentMovie = movies[currentIndex];

    return (
      <main className={styles.main}>
        <button onClick={resetApp} className={styles.backButton}>
          &larr; Change Genre
        </button>

        <div className={styles.card}>
          <Image 
            src={getImageUrl(currentMovie.poster_path)}
            alt={currentMovie.title}
            width={500}
            height={750}
            className={styles.cardImage}
          />
          <div className={styles.cardInfo}>
            <h3>{currentMovie.title} ({currentMovie.release_date.split('-')[0]})</h3>
            <p>⭐ {currentMovie.vote_average.toFixed(1)} / 10</p>
            <p className={styles.overview}>{currentMovie.overview}</p>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button 
            onClick={handleNext} 
            className={styles.nextButton}
            disabled={currentIndex === movies.length - 1} 
          >
            Next &rarr;
          </button>
        </div>
      </main>
    );
  }

  return null;
}