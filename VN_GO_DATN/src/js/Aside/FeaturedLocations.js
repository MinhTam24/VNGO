import React, { Component } from 'react'

export class FeaturedLocations extends Component {
    render() {
        return (
            <>
                <div className="highlighted-locations">
                    <video width="350" height="300" controls>
                        <source src="/video/Video.mp4" type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ thẻ video.
                    </video>
                </div>
            </>
        )
    }
}

export default FeaturedLocations