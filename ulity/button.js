import { UploadOutlined,DeleteOutlined , MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export const Button_Delete = ({fx}) => {
    return (<button className="flex gap-1 items-center text-red-500 hover:text-red-400 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
        onClick={fx}
        type="button">
        <DeleteOutlined />
    </button>)
}
export const Button_Add = ({fx}) => {
    return (<button className="flex gap-1 items-center text-green-500 hover:text-green-400 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
        onClick={fx}
        type="button">
        <PlusOutlined />
    </button>)
}