import { useState } from 'react'
import './App.css';

const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const FIFTHS = ['B', 'E', 'A', 'D', 'G', 'C', 'F']
const FLAT_OFFSETS = [16, 1, 21, 6, 26, 11, 31]
const SHARP_OFFSETS = [1, 16, -3, 11, 26, 6, 21]

const KeySignature = ({ root, scale }) => {
  let accidentals
  const usingFlats = root.substring(1, 2) === '♭'
  if(usingFlats) {
    // Use flats
    accidentals = FIFTHS.map(note => {
      const noteInScale = scale.find(n => n.substring(0, 1) === note)
      return noteInScale.substring(1, noteInScale.length).replaceAll('♭♭', '𝄫')
    })
  } else {
    // use sharps
    accidentals = FIFTHS.toReversed().map(note => {
      const noteInScale = scale.find(n => n.substring(0, 1) === note)
      return noteInScale.substring(1, noteInScale.length)
    })
  }

  return (
    <div className="key-signature">
      <img src="treble_clef.png" className="treble-clef" />
      <hr className="staff-line" />
      <hr className="staff-line" />
      <hr className="staff-line" />
      <hr className="staff-line" />
      <hr className="staff-line" />

      {accidentals.map((a, i) => (
        <span
          className="accidental"
          style={{
            left: i * 20 + 45,
            top: usingFlats ? FLAT_OFFSETS[i] : SHARP_OFFSETS[i]
          }}
        >
          {a}
        </span>
      ))}
    </div>
  )
}

const Scale = ({ root }) => {

  const getNextNote = (note, step) => {
    let start = note[0]
    
    // step must be 'whole' or 'half'
    let noteIndex = NOTES.findIndex(n => n === start)
    let nextNote = NOTES[(noteIndex + 1) % NOTES.length]
        
    if(step === 'whole') {
      if (start === 'E' || start === 'B') {
        return [ nextNote, 1 + note[1]]
      } else {
        return [ nextNote, 0 + note[1]]
      }
    } else if(step === 'half') {
      if (start === 'E' || start === 'B') {
        return [ nextNote, 0 + note[1]]
      } else {
        return [ nextNote, -1 + note[1]]
      }
    }
  }

  let offset = root.length - 1
  if(root.substring(1, 2) === '♭') {
    offset *= -1
  }
  
  let scale = []
  let currentNote = [ root.substring(0, 1), offset ]
  let nextNote = []
  scale.push(root)
  for(let i=0; i<6; i++) {
    if (i === 2 || i === 6) {
      nextNote = getNextNote(currentNote, 'half')
    } else {
      nextNote = getNextNote(currentNote, 'whole')
    }

    if(nextNote[1] < 0) {
      scale.push(
        nextNote[0] + (new Array(Math.abs(nextNote[1]))).fill().map(e=>'♭').join('')
      )
    } else if(nextNote[1] > 0) {
      scale.push(
        nextNote[0] + (new Array(nextNote[1])).fill().map(e=>'♯').join('')
      )
    } else {
      scale.push(
        nextNote[0]
      )
    }
    currentNote = nextNote
  }

  return (<div>
            <p>You should use the key of {root.replaceAll('♭♭', '𝄫').replaceAll('♯♯', '𝄪')} major!</p>
            <div><i>Notes in the Scale</i></div>
            <table border={1} cellPadding={5}>
              <tbody>
                <tr>
                  {scale.map(n => <td key={n}>{n.replaceAll('♭♭', '𝄫').replaceAll('♯♯', '𝄪')}</td>)}
                  <td>{scale[0].replaceAll('♭♭', '𝄫').replaceAll('♯♯', '𝄪')}</td>
                </tr>
              </tbody>
            </table>

            <div><i>Key Signature</i></div>
            <KeySignature scale={scale} root={root} />
          </div>)
}

const App = () => {
  const [ key, setKey ] = useState(null)

  const handleRandomKey = (sharpsOrFlats) => {
    const randomNote = NOTES[Math.floor(Math.random() * NOTES.length)]
    const randomNumber = Math.floor(Math.random() * 6) + 2
    let accidental = ''
    
    if(sharpsOrFlats === 'sharps') {
      accidental = '♯'
    } else if(sharpsOrFlats === 'flats') {
      accidental = '♭'
    }

    let randomKey = randomNote
    for(let i=0; i<randomNumber; i++) {
      randomKey += accidental
    }

    setKey(randomKey)
  }

  if(key) {
    return (
      <>
        <Scale root={key} />

        <div>
          <p>Or try a different scale?</p>
          <button onClick={() => handleRandomKey('sharps')}>I like sharps!</button>
          <button onClick={() => handleRandomKey('flats')}>I like flats!</button>
        </div>

      </>
    )
  } else {
    return (
      <>
        <div>
          <p>What key should you use for your next musical project?</p>
          <button onClick={() => handleRandomKey('sharps')}>I like sharps!</button>
          <button onClick={() => handleRandomKey('flats')}>I like flats!</button>
        </div>
      </>
    )
  }
}

export default App;
