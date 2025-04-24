import '../../css/Explore.css';

const destinations = [
    {
        id: "vung-tau",
        title: "Vũng Tàu",
        description: "Danh sách chuyến đi ở Vũng Tàu",
        cards: [
            {
                id: "vung-tau-card-1",
                imgSrc: "/img/avt.jpg",
                title: "Vũng tàu đi lang thang",
                text: "Nội dung của card nhỏ 1.",
                link: "/html/tourdetails.html",
            },
            {
                id: "vung-tau-card-2",
                imgSrc: "/img/avt.jpg",
                title: "Vũng tàu đi lang thang",
                text: "Nội dung của card nhỏ 2.",
                link: "/html/tourdetails.html",
            },
            {
                id: "vung-tau-card-3",
                imgSrc: "/img/avt.jpg",
                title: "Vũng tàu đi lang thang",
                text: "Nội dung của card nhỏ 2.",
                link: "/html/tourdetails.html",
            },
            {
                id: "vung-tau-card-4",
                imgSrc: "/img/avt.jpg",
                title: "Vũng tàu đi lang thang",
                text: "Nội dung của card nhỏ 2.",
                link: "/html/tourdetails.html",
            },
        ],
    },
    {
        id: "nha-trang",
        title: "Nha Trang",
        description: "79 Nha Trang tôi yêu",
        cards: [
            {
                id: "nha-trang-card-1",
                imgSrc: "/img/avt.jpg",
                title: "Nha Trang khám phá",
                text: "Nội dung của card nhỏ 1.",
                link: "/html/tourdetails.html",
            },
            {
                id: "nha-trang-card-2",
                imgSrc: "/img/avt.jpg",
                title: "Nha Trang phiêu lưu",
                text: "Nội dung của card nhỏ 2.",
                link: "/html/tourdetails.html",
            },
            {
                id: "nha-trang-card-3",
                imgSrc: "/img/avt.jpg",
                title: "Nha Trang khám phá",
                text: "Nội dung của card nhỏ 1.",
                link: "/html/tourdetails.html",
            },
            {
                id: "nha-trang-card-4",
                imgSrc: "/img/avt.jpg",
                title: "Nha Trang phiêu lưu",
                text: "Nội dung của card nhỏ 2.",
                link: "/html/tourdetails.html",
            },
        ],
    },
];

const Explore = () => {
    return (
        <main className="col-sm-9">
            <div className="text-center mt-2">
                <h1 className="display-4">Khám Phá</h1>
                <p className="lead">Khám phá các điểm đến tuyệt đẹp và tận hưởng những trải nghiệm khó quên.</p>
            </div>
            {destinations.map((destination) => (
                <div className="row" key={destination.id}>
                    <div className="container mt-2 mb-3">
                        <div className="card">
                            <div className="auth-bg-container">
                                <div className="auth-bg-text">
                                    <h1 id={destination.id}>{destination.title}</h1>
                                    <h6>{destination.description}</h6>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {destination.cards.map((card) => (
                                        <div
                                            className="card col-md-3"
                                            key={card.id}
                                            id={card.id}
                                        >
                                            <img
                                                src={card.imgSrc}
                                                className="card-img-top"
                                                alt={card.title}
                                            />
                                            <div className="card-body">
                                                <h6 className="card-title">{card.title}</h6>
                                                <p className="card-text">{card.text}</p>
                                                <a href={card.link} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="row">
                                    <div className="col-12 text-end mt-2">
                                        <a
                                            href="/tours"
                                            className="btn btn-dark btn-view-all"
                                            style={{ borderRadius: "0" }}
                                        >
                                            Xem tất cả
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </main>
    );
};

export default Explore;
