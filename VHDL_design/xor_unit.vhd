library ieee;
use ieee.STD_LOGIC_1164.all;


entity Xor_unit is 
	generic (au_bw : integer := 16);
	port (
		a,b: in std_logic_vector(au_bw - 1 downto 0)  := (others => '0');
		output : out std_logic_vector(au_bw - 1 downto 0) := (others => '0')
	);
end Xor_unit;


architecture Behavioral of Xor_unit is
begin
	process(a,b)

	begin
		for  i in (au_bw - 1) downto 0 loop
			output(i) <= a(i) xor b(i);
		end loop;
	end process;


end Behavioral;
