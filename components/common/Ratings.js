import React from 'react'

const Ratings = () => {
  return (
    <section id="rate" className="rating">
      <input type="radio" id="star_5" name="rate" value="5" />
      <label htmlFor="star_5" title="Five">&#9733;</label>
      <input type="radio" id="star_4" name="rate" value="4" />
      <label htmlFor="star_4" title="Four">&#9733;</label>
      <input type="radio" id="star_3" name="rate" value="3" />
      <label htmlFor="star_3" title="Three">&#9733;</label>
      <input type="radio" id="star_2" name="rate" value="2" />
      <label htmlFor="star_2" title="Two">&#9733;</label>
      <input type="radio" id="star_1" name="rate" value="1" />
      <label htmlFor="star_1" title="One">&#9733;</label>
    </section>
  )
}

export default Ratings