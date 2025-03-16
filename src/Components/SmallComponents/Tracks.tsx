import React from 'react'

export const Tracks = ({tracks} : {tracks : File[]}) => {
  return (
    <div>
      {tracks.map((track, index) => (
        <div key={index}>
          <h3>{track.name}</h3>
          <audio controls>
            <source src={URL.createObjectURL(track)} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  )
}
