import React from 'react'

const Ads = ({ adCode }) => {
  React.useEffect(() => {
    if (window) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  return (
    <ins className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-2847418034592467"
      data-ad-slot={adCode}
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
  )
}

export default Ads