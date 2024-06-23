import { Models } from 'appwrite';
import { Loader_Circle } from './Loader';
import GridPostList from './GridPostList';

type SearchResultsProps = {
    isSearchFetching: boolean,
    searchedPosts: Models.Document[] | undefined; // Ensure it's either an array of Document or undefined
}

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultsProps) => {
    if (isSearchFetching) return <Loader_Circle />;

    // Ensure searchedPosts is defined and is an array before accessing its elements
    const documents = searchedPosts?.map(doc => doc); // Example mapping function, adjust as per your usage
    
    if (documents && documents.length > 0) {
        return <GridPostList posts={documents} />;
    }

    return (
        <p className='text-light-4 mt-10 text-center w-full'>
            Sorry, no posts found based on your search :(
        </p>
    );
}

export default SearchResults;
