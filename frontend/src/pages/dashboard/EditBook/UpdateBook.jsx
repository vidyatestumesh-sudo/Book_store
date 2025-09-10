import React, { useEffect, useState } from 'react';
import InputField from '../addBook/InputField';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchBookByIdQuery } from '../../../redux/features/books/booksApi';
import Loading from '../../../components/Loading';
import Swal from 'sweetalert2';
import axios from 'axios';
import getBaseUrl from '../../../utils/baseURL';

const toNum = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const clamp = (x, min, max) => Math.min(max, Math.max(min, x));
const roundMoney = (n) => Math.max(0, Math.round(n));
const roundPct = (n) => clamp(Math.round(n), 0, 100);

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: bookData, isLoading, isError, refetch } = useFetchBookByIdQuery(id);

  const { register, handleSubmit, setValue, watch, getValues } = useForm({
    defaultValues: {
      title: '',
      author: '',
      description: '',
      oldPrice: '',
      newPrice: '',
      discount: '',
      coverImage: ''
    }
  });

  const [lastEdited, setLastEdited] = useState(null); // 'oldPrice' | 'newPrice' | 'discount' | null

  // Populate existing values
  useEffect(() => {
    if (bookData) {
      setValue('title', bookData.title || '');
      setValue('author', bookData.author || '');
      setValue('description', bookData.description || '');
      setValue('oldPrice', bookData.oldPrice ?? '');
      setValue('newPrice', bookData.newPrice ?? '');
      // If discount missing in DB, derive from prices once:
      const derivedDisc = bookData.oldPrice
        ? roundPct(((bookData.oldPrice - (bookData.newPrice ?? 0)) / bookData.oldPrice) * 100)
        : 0;
      setValue('discount', bookData.discount ?? derivedDisc);
      setValue('coverImage', bookData.coverImage || '');
    }
  }, [bookData, setValue]);

  // Watch for preview
  const oldPrice = toNum(watch('oldPrice'));
  const newPrice = toNum(watch('newPrice'));
  const discount = toNum(watch('discount'));

  // Handlers to avoid loops
  const handleOldPriceChange = (e) => {
    setLastEdited('oldPrice');
    const oldP = toNum(e.target.value);
    const disc = toNum(getValues('discount'));
    const np = toNum(getValues('newPrice'));

    if (disc > 0) {
      const calcNew = roundMoney(oldP * (1 - disc / 100));
      setValue('newPrice', calcNew, { shouldDirty: true, shouldValidate: false });
    } else if (np > 0) {
      const calcDisc = roundPct(((oldP - np) / (oldP || 1)) * 100);
      setValue('discount', calcDisc, { shouldDirty: true, shouldValidate: false });
    }
  };

  const handleDiscountChange = (e) => {
    setLastEdited('discount');
    const disc = clamp(toNum(e.target.value), 0, 100);
    const oldP = toNum(getValues('oldPrice'));
    if (oldP > 0) {
      const calcNew = roundMoney(oldP * (1 - disc / 100));
      setValue('discount', disc, { shouldDirty: true, shouldValidate: false });
      setValue('newPrice', calcNew, { shouldDirty: true, shouldValidate: false });
    }
  };

  const handleNewPriceChange = (e) => {
    setLastEdited('newPrice');
    const np = toNum(e.target.value);
    const oldP = toNum(getValues('oldPrice'));
    if (oldP > 0) {
      const calcDisc = roundPct(((oldP - np) / oldP) * 100);
      setValue('newPrice', np, { shouldDirty: true, shouldValidate: false });
      setValue('discount', calcDisc, { shouldDirty: true, shouldValidate: false });
    }
  };

  useEffect(() => {
    if (!oldPrice) {
      if (lastEdited === 'discount') {
        setValue('newPrice', '', { shouldDirty: true, shouldValidate: false });
      } else if (lastEdited === 'newPrice') {
        setValue('discount', '', { shouldDirty: true, shouldValidate: false });
      }
    }
  }, [oldPrice]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data) => {
    const payload = {
      title: data.title,
      author: data.author,
      description: data.description,
      oldPrice: toNum(data.oldPrice),
      newPrice: toNum(data.newPrice),
      discount: toNum(data.discount),
      coverImage: data.coverImage || bookData.coverImage
    };

    try {
      await axios.put(`${getBaseUrl()}/api/books/edit/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      Swal.fire({
        title: 'Book Updated',
        text: 'Your book is updated successfully!',
        icon: 'success',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        refetch();
        navigate('/dashboard/manage-books');
      });

    } catch (error) {
      console.log('Failed to update book.');
      alert('Failed to update book.');
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Error fetching book data</div>;

  return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Book</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField label="Title" name="title" placeholder="Enter book title" register={register} />
        <InputField label="Author" name="author" placeholder="Enter author's name" register={register} />
        <InputField label="Description" name="description" placeholder="Enter book description" type="textarea" register={register} />

        {/* Pricing block with live, no-flicker logic */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Old Price</label>
            <input
              type="number"
              step="1"
              min="0"
              inputMode="numeric"
              className="w-full border rounded-md px-3 py-2"
              {...register('oldPrice', { onChange: handleOldPriceChange })}
              placeholder="Old Price"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">New Price</label>
            <input
              type="number"
              step="1"
              min="0"
              inputMode="numeric"
              className="w-full border rounded-md px-3 py-2"
              {...register('newPrice', { onChange: handleNewPriceChange })}
              placeholder="New Price"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Discount (%)</label>
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              inputMode="numeric"
              className="w-full border rounded-md px-3 py-2"
              {...register('discount', { onChange: handleDiscountChange })}
              placeholder="Discount %"
            />
          </div>
        </div>

        {/* Live Preview */}
        {oldPrice > 0 && (newPrice > 0 || discount > 0) && (
          <p className="mt-3 text-sm text-gray-700">
            Final Price:&nbsp;
            <span className="font-semibold text-green-600">₹{newPrice || 0}</span>
            {discount > 0 && <span className="ml-2 text-red-500 font-semibold">({roundPct(discount)}% OFF)</span>}
          </p>
        )}

        <button type="submit" className="w-full py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md transition duration-300">
          Update Book
        </button>
      </form>
    </div>
  );
};

export default UpdateBook;
