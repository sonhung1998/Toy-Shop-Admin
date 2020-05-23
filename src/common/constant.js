const CATEGORIES = [
    {
        id: 0,
        value: 'Tất cả'
    },

    {
        id: 1,
        value: 'Đồ chơi máy cẩu - máy xúc'
    },
    {
        id: 5,
        value: 'Ô tô Điện'

    },
    {
        id: 6,
        value: 'Ô tô điều khiển từ xa'
    },
    {
        id: 7,
        value: 'Ô tô bằng gỗ'
    },
    {
        id: 8,
        value: 'Ô tô biến hình'
    }

]
const MANUFACTURERS = [
    {
        id: 0,
        value: 'Tất cả'
    },

    {
        id: 1,
        value: 'Hyundai Thành Công'
    },
    {
        id: 2,
        value: 'Thaco'

    },
    {
        id: 3,
        value: 'Remax'
    },
    {
        id: 4,
        value: 'Mạnh Quân Auto'
    }
]

const ORDERSTATUS = [
    {
        id:'PENDING',
        value:'Chờ xử lý'
    },
    {
        id:'SUCCESS',
        value:'Thành công',
    },
    {
        id:'REJECT',
        value:'Thất bại'
    }
]
const ROLE = [
    {
        id: 1,
        value: 'Customer'
    },
    {
        id: 2,
        value: 'Admin'
    }
]
export { CATEGORIES, MANUFACTURERS, ORDERSTATUS, ROLE }