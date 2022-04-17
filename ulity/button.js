import { UploadOutlined, DeleteOutlined,ArrowsAltOutlined, ShrinkOutlined,MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export const Button_Delete = ({ fx, title }) => {
    return (<><button className="flex gap-1 items-center text-red-500 hover:text-red-400 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
        onClick={fx}
        type="button">
        <DeleteOutlined />
    </button>{title && <span>{title}</span>}
    </>)
}
export const Button_Add = ({ fx }) => {
    return (<button className="flex gap-1 items-center text-green-500 hover:text-green-400 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
        onClick={fx}
        type="button">
        <PlusOutlined />
    </button>)
}
export const Button_Collapsed = ({ fx , is=false }) => {
    return (<button className="flex gap-1 items-center text-blue-900 hover:text-blue-800 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
        onClick={fx}
        type="button">
        {is ? <ShrinkOutlined /> : <ArrowsAltOutlined />}
    </button>)
}