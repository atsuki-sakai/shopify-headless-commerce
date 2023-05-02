import React from 'react'

interface Props {
    questionText: string
    answerText: string
}

const FaqDetail = ({ questionText, answerText }: Props) => {
    return (
        <>
            <details className='mb-4'>
                <summary className="bg-white text-gray-700 text-left text-sm md:text-base xl:text-lg font-bold  sm:text-left shadow-md border rounded-md py-3 px-6">
                    { questionText }
                </summary>
                <div className='my-3'>
                    <div className='bg-white rounded-lg p-5 shadow-sm'>
                        <span className='text-gray-600 text-left text-sm md:text-base xl:text-lg tracking-wide'>
                            <p className='text-green-500 font-bold'>Answer</p>
                            <p className='p-2 bg-gray-100 rounded-md'>
                                { answerText }
                            </p>
                        </span>
                    </div>
                </div>
            </details>
        </>
    )
}

export default FaqDetail