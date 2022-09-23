import { useState } from 'react'
import { useNavigate, useMatch } from 'react-router-dom'

export const Search = () => {
  const match = useMatch('/search/:keyword')

  const [search, setSearch] = useState(match?.params.keyword || '')
  const navigate = useNavigate()

  const searchHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (search.trim()) {
      navigate(`/search/${search}`)
    } else {
      navigate(`/`)
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  return (
    <form onSubmit={searchHandler}>
      <div className='input-group'>
        <input
          type='text'
          id='search_field'
          className='form-control'
          placeholder='Enter product name...'
          value={search}
          onChange={handleSearchChange}
        />
        <div className='input-group-append'>
          <button id='search_btn' className='btn'>
            <i className='fa fa-search' aria-hidden='true'></i>
          </button>
        </div>
      </div>
    </form>
  )
}
