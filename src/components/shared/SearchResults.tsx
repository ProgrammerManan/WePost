import { Models } from 'appwrite'
import React from 'react'
import { Loader_Circle } from './Loader';
import GridPostList from './GridPostList';

type SearchResultsProps = {
    isSearchFetching: boolean,
    searchedPosts: Models.Document[]; 
}

const SearchResults = ({isSearchFetching, searchedPosts} : SearchResultsProps) => {
    if(isSearchFetching) return <Loader_Circle/>
    if(searchedPosts && searchedPosts.documents.length > 0) {
        return (
            <GridPostList posts={searchedPosts.documents}/>
        )
    }
  return (
    <p className='text-light-4 mt-10 text-center w-full'>Sorry, no posts found based on your search :(</p>
  )
}

export default SearchResults