import React from "react";
import { useParams } from "react-router";
import ActorDetails from "../components/actorDetails";
import PageHeader from "../components/pageHeader";
import { usePersonDetails } from "../hooks/usePersonDetails";
import { usePersonMovieCredits } from "../hooks/usePersonMovieCredits";
import { getPersonDetails, getPersonMovieCredits } from "../api/tmdb-api";

/**
 * Page component that displays comprehensive details about an actor/person.
 *
 * I extract the actor ID from the URL parameters and fetch two pieces of information in parallel:
 * biographical details (name, biography, profile image) and their complete filmography (movies
 * they've appeared in). I use two separate custom hooks to handle these requests independently
 * with proper caching and state management.
 *
 * I handle loading and error states for the biographical information using the PersonState component.
 * If the filmography is still loading, I pass the FilmographyState component to ActorDetails,
 * which displays loading skeletons for the filmography section while the data loads.
 *
 * @component
 * @returns {React.ReactElement} A page component displaying the actor's biography, profile image,
 *                               and their complete filmography with links to individual movies
 *
 * @example
 * // Used in routing configuration at path: /actor/:id
 * import ActorDetailsPage from './pages/actorDetailsPage';
 * // Then add to your router configuration
 */
const ActorDetailsPage = () => {
  // I extract the actor ID from the URL route parameters. This ID is used to fetch
  // the specific person's data from the TMDB API.
  const { id } = useParams();

  // I fetch the actor's biographical information (name, biography, profile image, etc.)
  // using the usePersonDetails hook, which handles caching and state management through
  // React Query. This hook also provides a PersonState component for rendering loading
  // and error states.
  const { person, PersonState } = usePersonDetails(id, getPersonDetails);

  // I fetch the actor's filmography (all movies they've appeared in) using the
  // usePersonMovieCredits hook. This runs in parallel with the biographical fetch,
  // allowing both requests to happen simultaneously.
  const { movies, FilmographyState } = usePersonMovieCredits(
    id,
    getPersonMovieCredits
  );

  // I check if there's a loading or error state for the biographical information.
  // The PersonState component renders skeleton loaders while fetching or an error
  // message if the fetch fails. If either state exists, I return that component and
  // exit early, since we need the person data to display the page.
  const personStateComponent = PersonState();
  if (personStateComponent) return personStateComponent;

  // I render the actor details page with the biographical information as the header
  // and the ActorDetails component to display the biography and filmography. I pass
  // the FilmographyState component to ActorDetails, which handles displaying loading
  // skeletons for the filmography section while the movie data is being fetched.
  return (
    <>
      <PageHeader title={person.name} />
      <ActorDetails
        person={person}
        movies={movies}
        FilmographyState={FilmographyState}
      />
    </>
  );
};

export default ActorDetailsPage;
