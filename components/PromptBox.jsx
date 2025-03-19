import React from 'react'

function PromptBox() {
  return (
    <form className={`w-full ${false ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}>
      <textarea rows={2} placeholder='Message to DeepSeek' required 
      className='outline-none'>
      </textarea>
    </form>
  )
}

export default PromptBox