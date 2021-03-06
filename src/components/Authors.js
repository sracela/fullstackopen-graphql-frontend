import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import Select from 'react-select';

const SetBirthYear = ({ setError, options }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState(1900)

  const [ editAuthor, result ] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  const submit = async (event) => {
    event.preventDefault()
    
    editAuthor({  variables: { name: name.value, setBornTo: born } })

    setName('')
    setBorn(1900)
  }
  

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setError('author not found')
    }
  }, [result.data])// eslint-disable-line 

  return (
    <div>
      <form onSubmit={submit}>
<div>
      <Select
        value={name}
        onChange={(selectedOption) => setName(selectedOption)}
        options={options}
      /></div>
        <div>
          born
          <input
            type='number'
            value={born}
            onChange={({ target }) => setBorn(parseInt(target.value) || 0)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

const Authors = ({show, setError}) => {
  const result = useQuery(ALL_AUTHORS)
  if (!show) {
    return null
  }
  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {result.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <br />
      <SetBirthYear setError={setError} options={result.data.allAuthors.map(a => {return {value: a.name, label: a.name}}) }/>
    </div>
  )
}

export default Authors
