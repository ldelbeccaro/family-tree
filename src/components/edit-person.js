import React from 'react'

import AllPeopleDropdown from '../components/all-people-dropdown'
import profileImage from '../images/profile-image.jpeg'

import '../styles/edit-person.styl'

// TODO: figure out why netlify can't build this
const contentful = require('contentful-management')

const client = contentful.createClient({
  accessToken: process.env.GATSBY_CONTENTFUL_MANAGEMENT_API_KEY
})

class EditPerson extends React.Component {
  constructor(props) {
    super(props)

    const person = props.person

    this.state = {
      name: person && person.name || ``,
      maidenName: person && person.maidenName || ``,
      birthday: person && person.birthday || ``,
      email: person && person.email || ``,
      phone: person && person.phone || ``,
      address: person && person.address ? person.address.childMarkdownRemark.internal.content : ``,
      mother: person && person.mother,
      father: person && person.father,
      spouse: person && person.spouse,
      children: person && person.contentfulchildren,
    }

    this.fileInput = undefined
    this.onSubmitPerson = this.onSubmitPerson.bind(this)
  }

  manipulateValue(field, value) {
    if (!value) return undefined;
    switch (field) {
      case `birthday`:
        return new Date(value)
      case `mother`:
      case `father`:
      case `spouse`:
        return {
          sys: {
            id: value.id.substr(1),
            type: `Link`,
            linkType: `Entry`,
          }
        }
      case `children`:
        return value.map(child => ({
          sys: {
            id: child.id.substr(1),
            type: `Link`,
            linkType: `Entry`,
          }
        }))
      default:
        return value
    }
  }

  handleValueChange(field, val) {
    this.setState({[`${field}`]: val})
  }

  updateContentful(personId, file) {
    if (personId) {
      // Update entry
      if (typeof window !== `undefined`) {
        window.mixpanel.track('Person Edited', {'Person Name': this.state.name})
      }

      client.getSpace(process.env.GATSBY_CONTENTFUL_SPACE_ID)
        .then((space) => space.getEntry(personId))
        .then((entry) => {
          for (const key of Object.keys(this.state)) {
            if (this.state[key]) {
              const val = this.manipulateValue(key, this.state[key])
              entry.fields[key] = {...entry.fields[key]}
              entry.fields[key][`en-US`] = val
            }
          }
          if (file) {
            entry.fields.image = {'en-US': file}
          }
          return entry.update()
        })
        .then((entry) => entry.publish())
        .catch(console.error)
    } else {
      // Create new entry
      if (typeof window !== `undefined`) {
        window.mixpanel.track('Person Created', {'Person Name': this.state.name})
      }

      client.getSpace(process.env.GATSBY_CONTENTFUL_SPACE_ID)
        .then((space) => {
          const fields = {}
          for (const key of Object.keys(this.state)) {
            if (this.state[key]) {
              const val = this.manipulateValue(key, this.state[key])
              fields[key] = {'en-US': val}
            }
          }
          if (file) {
            fields.image = {'en-US': file}
          }
          return space.createEntry('person', {fields})
        })
        .then((entry) => entry.publish())
        .catch(console.error)
    }
  }

  onSubmitPerson(personId, e) {
    e.preventDefault()
    personId = personId ? personId.substr(1) : undefined

    if (this.fileInput.files[0]) {
      const file = this.fileInput.files[0]
      client.getSpace(process.env.GATSBY_CONTENTFUL_SPACE_ID)
        .then(space => {
          space.createAssetFromFiles({
            fields: {
              title: {
                'en-US': file.name
              },
              file: {
                'en-US': {
                  contentType: file.type,
                  fileName: file.name,
                  file: file
                }
              }
            }
          })
          .then(asset => asset.processForAllLocales())
          .then(asset => asset.publish())
          .then(asset => {
            const file = {"sys": {"id": asset.sys.id, "linkType": "Asset", "type": "Link"}}
            this.updateContentful(personId, file)
          })
          .catch(console.error);
        })
    } else {
      this.updateContentful(personId)
    }

    this.props.onClickClose()
  }

  getSelectedIds(person, field) {
    if (!person || !this.state[field]) return []
    if (this.state[field].id) {
      // one object
      return [this.state[field].id]
    }
    else {
      // array of objects
      return this.state[field].map(child => child.id)
    }
  }

  render() {
    const person = this.props.person
    const imageUrl = person && person.image ? person.image.file.url : profileImage

    return (
      <form
        className='edit-person'
        onSubmit={(e) => this.onSubmitPerson(person ? person.id : undefined, e)}
      >
        <div className='image-section'>
          <img className='image' src={imageUrl} alt='' />
          <div className='image-input'>
            <div className='help-text'>Change image (square images work best):</div>
            <input type='file' ref={node => this.fileInput = node} />
          </div>
        </div>
        {[`name`, `maidenName`, `birthday`, `email`, `phone`].map(field => (
          <div className='input' key={field}>
            <div className='input-label'>{field === `maidenName` ? `maiden name` : field}</div>
            <input
              name={field}
              value={this.state[field]}
              type='text'
              onChange={(e) => this.handleValueChange(field, e.target.value)}
            />
          </div>
        ))}
        <div className='input'>
          <div className='input-label'>Address</div>
          <textarea
            name='address'
            value={this.state.address}
            rows='3'
            onChange={(e) => this.handleValueChange(`address`, e.target.value)}
            data-gramm_editor='false'
          ></textarea>
        </div>
        {[`mother`, `father`, `spouse`, `children`].map(field => (
          <div className='input' key={field}>
            <div className='input-label'>{field}</div>
            <AllPeopleDropdown
              people={this.props.people}
              multiSelect={field === `children`}
              fieldName={field}
              selectedPeople={this.getSelectedIds(person, field)}
              handleChange={val => this.handleValueChange(field, val)}
            />
          </div>
        ))}
        <div className='submit-container'>
          <input type='submit' value='Save *' />
        </div>
        <div className='help-text'>* Changes will be displayed live if you refresh in a minute or so</div>
      </form>
    )
  }
}

export default EditPerson
