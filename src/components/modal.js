import React from 'react'

import '../styles/modal.styl'

class Modal extends React.Component {
  componentDidMount() {
    this.setMaxHeight();
  }

  componentWillReceiveProps() {
    this.setMaxHeight();
  }

  componentDidUpdate() {
    this.scrollToTopOfModal();
    this.setMaxHeight();
  }

  scrollToTopOfModal() {
    // component did update should trigger whenever the props change
    // in this case, that indicates that the modal content has changed
    // we reposition the user back at the top of the modal
    const modalContent = document.querySelector(`.modal`);

    // component may have unmounted
    if (modalContent) {
      modalContent.scrollTop = 0;
    }
  }

  setMaxHeight() {
    const modal = document.querySelector(`.modal`);
    if (modal && typeof window !== `undefined`) {
      const rect = modal.getBoundingClientRect();
      const maxHeight = window.innerHeight - rect.top - 100; // 100px of padding at bottom of screen
      modal.style.maxHeight = `${maxHeight}px`;
    }
  }

  render() {
    return (
      <div className='modal-container'>
        <div className='background' onClick={this.props.onClickClose}></div>
        <div className='modal'>
          <div className='close' onClick={this.props.onClickClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>
          {this.props.children}
        </div>
      </div>
    )  
  }
}

export default Modal
