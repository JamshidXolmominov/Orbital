import React from 'react';
import { useNavigate } from 'react-router-dom';

function Instructions({ examData, setView, startTimer }) {
	const navigate = useNavigate();
	return (
		<div className='flex flex-col items-center gap-5'>
			<ul className='flex flex-col gap-1'>
				<h1 className='text-2xl underline'>Ko'rsatmalar</h1>
				<li>Imtihon {examData.duration} soniyada yakunlanishi kerak.</li>
				<li>Imtihon {examData.duration} soniyadan keyin avtomatik ravishda topshiriladi.</li>
				<li>Yuborilgandan so'ng, siz javoblaringizni o'zgartira olmaysiz.</li>
				<li>Sahifani yangilamang.</li>
				<li>
					Savollar orasida harakat qilish uchun <span className='font-bold'>"Oldingi"</span> and("
					")
					<span className='font-bold'>"Keyingi"</span> tugmalaridan foydalanishingiz mumkin.
				</li>
				<li>
					Imtihonning umumiy ballari <span className='font-bold'>{examData.totalMarks}</span>.
				</li>
				<li>
					Imtihondan o'tish ballari <span className='font-bold'>{examData.passingMarks}</span>.
				</li>
			</ul>

			<div className='flex gap-2'>
				<button className='primary-outlined-btn' onClick={() => navigate('/')}>
					YOPISH
				</button>

				<button
					className='primary-contained-btn'
					onClick={() => {
						startTimer();
						setView('questions');
					}}
				>
					Imtihonni boshlash
				</button>
			</div>
		</div>
	);
}

export default Instructions;
