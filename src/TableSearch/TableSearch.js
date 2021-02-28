import React from 'react'

export default props => {
    return (
        <div className="input-group mb-3 mt-3">
            <input
             type="text"
             className="form-control"
             placeholder="Введите текст"
             aria-label="Recipient's username"
             aria-describedby="button-addon2"
             onChange = {props.onSearch}
            />
        </div>
    )
}