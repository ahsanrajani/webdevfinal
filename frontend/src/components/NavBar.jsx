import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const NavBar = () => {
    const [visible, setVisible] = useState(false);
    const [showMegaMenu, setShowMegaMenu] = useState(false); 
    const { setShowSearch, getCartCount } = useContext(ShopContext);
    const navigate = useNavigate();

    
    const handleLogout = () => {
        localStorage.removeItem('userId'); 
        navigate('/login'); 
    };

    return (
        <div className='w-full'>
            
            <div className='flex items-center justify-between py-5 px-4 sm:px-[5vw]'>
                <Link to='/'>
                    <img src={assets.logo} className='w-36' alt="Fashion Hub" />
                </Link>
                <div className='flex items-center gap-6'>
                    <img
                        onClick={() => setShowSearch(true)}
                        src={assets.search_icon}
                        className='w-5 cursor-pointer'
                        alt="Search Products"
                    />
                    <div className='relative group'>
                        {localStorage.getItem('userId') ? ( 
                            <Link to='/orders'>
                                <img src={assets.profile_icon} className='w-5 cursor-pointer' alt="Your Profile" />
                            </Link>
                        ) : (
                            <Link to='/login'>
                                <img src={assets.profile_icon} className='w-5 cursor-pointer' alt="Login" />
                            </Link>
                        )}
                        <div className='absolute right-0 hidden pt-4 group-hover:block dropdown-menu' style={{ zIndex: 50 }}>
                            <div className='flex flex-col gap-2 px-5 py-3 text-gray-500 rounded w-36 bg-slate-100'>
                                {localStorage.getItem('userId') ? (
                                    <>
                                        <Link to='/orders'>
                                            <p className='cursor-pointer hover:text-black'>Orders</p>
                                        </Link>
                                        <p className='cursor-pointer hover:text-black' onClick={handleLogout}>Logout</p>
                                    </>
                                ) : (
                                    <Link to='/login'>
                                        <p className='cursor-pointer hover:text-black'>Login</p>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    <Link to='/cart' className='relative'>
                        <img src={assets.cart_icon} className='w-5 min-w-5' alt="Cart" />
                        <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                    </Link>
                    <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="Menu Icon" />
                </div>
            </div>

            
            <div className='bg-black py-2 relative hidden md:block'>
                <ul className='flex justify-center gap-8 text-sm text-white'>
                    <NavLink to='/' className='hover:underline'>
                        HOME
                    </NavLink>
                    <div
                        className='relative group'
                        onMouseEnter={() => setShowMegaMenu(true)}
                        onMouseLeave={() => setShowMegaMenu(false)}
                    >
                        <NavLink to='/collection' className='hover:underline'>
                            SHOP
                        </NavLink>
                        
                        {showMegaMenu && (
                            <div className='absolute left-0 top-full bg-white shadow-lg p-4 flex flex-col gap-2 text-black'>
                                <NavLink to='/collection/men' className='hover:text-gray-700'>
                                    MEN
                                </NavLink>
                                <NavLink to='/collection/women' className='hover:text-gray-700'>
                                    WOMEN
                                </NavLink>
                                <NavLink to='/collection/kids' className='hover:text-gray-700'>
                                    KIDS
                                </NavLink>
                            </div>
                        )}
                    </div>
                    <NavLink to='/about' className='hover:underline'>
                        ABOUT
                    </NavLink>
                    <NavLink to='/contact' className='hover:underline'>
                        CONTACT
                    </NavLink>
                </ul>
            </div>

            
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <img src={assets.dropdown_icon} className='h-4 rotate-180' alt="Dropdown" />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'>SHOP</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection/men'>MEN</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection/women'>WOMEN</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection/kids'>KIDS</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
